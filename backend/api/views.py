from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from .models import Word, Review, LevelProgress, WordBank
from .serializers import WordSerializer, ReviewSerializer, WordSerializer
from .services.services_tr import translate_word
import random
from .services.dictionary_service import DictionaryService
from .services.wordbank_service import WordBankService

LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"]
User = get_user_model()

def health_check(request):
    return JsonResponse({
        "status": "ok",
        "service": "Recall Vocab API"
    })

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = (request.data.get("username") or "").strip()
        password = request.data.get("password") or ""

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=400)

        try:
            validate_password(password)
        except ValidationError as error:
            return Response({"error": " ".join(error.messages)}, status=400)

        existing_user = User.objects.filter(username=username).first()
        if existing_user:
            return Response({"error": "An account with this username already exists."}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            is_active=True,
        )

        return Response(
            {"id": user.id, "username": user.username, "message": "Registration successful."},
            status=status.HTTP_201_CREATED,
        )


class MeView(APIView):
    def get(self, request):
        return Response({"id": request.user.id, "username": request.user.username})


class ChangePasswordView(APIView):
    def post(self, request):
        current_password = request.data.get("current_password") or ""
        new_password = request.data.get("new_password") or ""

        if not current_password or not new_password:
            return Response({"error": "current_password and new_password are required."}, status=400)

        if not request.user.check_password(current_password):
            return Response({"error": "Current password is incorrect."}, status=400)

        try:
            validate_password(new_password)
        except ValidationError as error:
            return Response({"error": " ".join(error.messages)}, status=400)

        request.user.set_password(new_password)
        request.user.save(update_fields=["password"])
        return Response({"message": "Password updated successfully."}, status=200)


class DeleteAccountView(APIView):
    def post(self, request):
        password = request.data.get("password") or ""
        if not password:
            return Response({"error": "password is required."}, status=400)

        if not request.user.check_password(password):
            return Response({"error": "Current password is incorrect."}, status=400)

        request.user.delete()
        return Response({"message": "Account deleted successfully."}, status=200)


class LevelWordsView(APIView):

    def get(self, request):

        progress, _ = LevelProgress.objects.get_or_create(user=request.user)

        count = int(request.query_params.get("count", 10))

        existing_words = Word.objects.filter(user=request.user).values_list(
            "english_word",
            flat=True
        )

        words = WordBankService.get_words_by_level(
            progress.current_level,
            exclude_words=existing_words,
            limit=count,
        )

        return Response({
            "level": progress.current_level,
            "words": words,
        })


class LevelWordsSubmitView(APIView):

    def post(self, request):

        results = request.data.get("results", [])

        if not results:
            return Response(
                {"error": "results is required"},
                status=400
            )

        progress, _ = LevelProgress.objects.get_or_create(user=request.user)

        known_count = 0

        for item in results:

            word = item.get("word")
            known = item.get("known")

            if not word:
                continue

            if known:
                known_count += 1
                continue

            # bilinmiyor -> kelime listesine ekle
            if Word.objects.filter(user=request.user, english_word__iexact=word).exists():
                continue

            bank = WordBankService.find_word(word)

            if not bank:
                continue

            bank_obj = WordBank.objects.get(word__iexact=bank["word"])
            Word.objects.create(
                user=request.user,
                word_bank=bank_obj,
                english_word=bank["word"],
                turkish_meaning=bank["meaning1"],
                turkish_meaning2=bank["meaning2"],
                turkish_meaning3=bank["meaning3"],
                level=bank["level"],
            )

        total = len(results)
        known_ratio = round(known_count / total, 2) if total else 0.0

        old_level = progress.current_level
        new_level = old_level
        current_index = LEVEL_ORDER.index(old_level)

        advanced = False
        decreased = False

        if known_ratio >= 0.8 and current_index < len(LEVEL_ORDER) - 1:
            new_level = LEVEL_ORDER[current_index + 1]
            advanced = True

        elif known_ratio <= 0.3 and current_index > 0:
            new_level = LEVEL_ORDER[current_index - 1]
            decreased = True

        progress.current_level = new_level
        progress.save()

        return Response({
            "known_ratio": known_ratio,
            "old_level": old_level,
            "new_level": new_level,
            "advanced": advanced,
            "decreased": decreased,
            "added_count": total - known_count,
        })

#--------------------------------------------------------------buraya kadar level kısmı

class AddWordView(APIView):

    def post(self, request):

        word = (request.data.get("word") or "").strip()
        direction = request.data.get("direction", "en_to_tr")

        if not word:
            return Response(
                {"error": "Word is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------
        # Türkçe -> İngilizce
        # -----------------------------
        if direction == "tr_to_en":

            english_word = translate_word(
                word,
                source_language="tr"
            )

            turkish_meaning = word

        # -----------------------------
        # İngilizce -> Türkçe
        # -----------------------------
        else:

            english_word = word

            turkish_meaning = ""

        if not english_word or (direction == "tr_to_en" and not turkish_meaning):

            return Response(
                {"error": "Translation could not be completed."},
                status=400
            )

        if Word.objects.filter(
            user=request.user,
            english_word__iexact=english_word
        ).exists():

            return Response(
                {"error": "Word already exists."},
                status=400
            )

        # -----------------------------------
        # Anlamları sırayla dene: CSV(DB) -> Gemini -> API
        # -----------------------------------

        result, source = WordBankService.resolve_meaning(english_word)
        print(f"DEBUG >> english_word='{english_word}' source={source} result={result}")

        # Türkçe girişte kullanıcının yazdığı anlam esas alınır. İngilizce
        # girişte ise kaynak havuzundan çözümlenen ana anlam kullanılır.
        meaning1 = turkish_meaning if direction == "tr_to_en" else (result["meaning1"] or turkish_meaning)
        meaning2 = result["meaning2"]
        meaning3 = result["meaning3"]
        level = result["level"]

        if not meaning1:
            return Response(
                {"error": "Translation could not be completed."},
                status=400,
            )

        bank_word, _ = WordBank.objects.get_or_create(
            word__iexact=english_word,
            defaults={
                "word": result.get("word") or english_word,
                "meaning1": meaning1,
                "meaning2": meaning2,
                "meaning3": meaning3,
                "level": level,
                "source": source if source in {"csv", "gemini", "api"} else "api",
            },
        )

        new_word = Word.objects.create(
            user=request.user,
            word_bank=bank_word,
            english_word=english_word,
            turkish_meaning=meaning1,
            turkish_meaning2=meaning2,
            turkish_meaning3=meaning3,
            level=level,
        )

        serializer = WordSerializer(new_word)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

class WordListView(APIView):

    def get(self, request):

        words = Word.objects.filter(user=request.user).order_by("-created_at")

        serializer = WordSerializer(
            words,
            many=True
        )

        return Response(serializer.data)


class RandomWordView(APIView):

    def get(self, request):

        word = Word.objects.filter(user=request.user).order_by("?").first()

        if not word:
            return Response(
                {"message": "No words found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = WordSerializer(word)

        return Response(serializer.data)
    
class DeleteWordView(APIView):

    def delete(self, request, pk):

        word = get_object_or_404(
            Word,
            pk=pk
            , user=request.user
        )

        word.delete()

        return Response(
            {
                "message": "Word deleted successfully"
            },
            status=status.HTTP_200_OK
        )
    
class ReviewWordView(APIView):

    def post(self, request):

        word_id = request.data.get("word_id")
        is_known = request.data.get("is_known")

        if word_id is None:
            return Response(
                {
                    "error": "word_id is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        word = get_object_or_404(
            Word,
            id=word_id,
            user=request.user,
        )

        review = Review.objects.create(
            word=word,
            is_known=is_known
        )

        if is_known:
            word.known_count += 1
        else:
            word.unknown_count += 1

        word.last_reviewed = timezone.now()
        word.save()

        total_reviews = word.known_count + word.unknown_count
        trust_point = round(word.known_count / total_reviews, 2) if total_reviews else 0.0

        return Response(
            {
                "success": True,
                "trust_point": trust_point,
                "known_count": word.known_count,
                "unknown_count": word.unknown_count,
            },
            status=status.HTTP_201_CREATED
        )
    
class WeakWordsView(APIView):

    def get(self, request):

        weak_word_ids = (
            Review.objects
            .filter(word__user=request.user, is_known=False)
            .values_list(
                "word_id",
                flat=True
            )
            .distinct()
        )

        words = Word.objects.filter(
            user=request.user,
            id__in=weak_word_ids,
        )

        serializer = WordSerializer(
            words,
            many=True
        )

        return Response(serializer.data)
    
class TranslateWordView(APIView):

    def post(self, request):

        word = (request.data.get("word") or "").strip()
        direction = request.data.get("direction", "en_to_tr")

        if not word:
            return Response(
                {"error": "Word required"},
                status=400
            )

        if direction == "tr_to_en":
            # Türkçe ifade, kullanıcının kaydedilecek ana anlamıdır. Bu
            # ekranda İngilizce karşılığını gösteririz; kaynak havuzu ise
            # seviye/ek anlam bilgisi için İngilizce karşılıkla aranır.
            english_word = translate_word(word, source_language="tr")
            if not english_word:
                return Response({"error": "Translation could not be completed."}, status=400)

            result, source = WordBankService.resolve_meaning(english_word)
            return Response({
                "meaning": result["word"],
                "turkish_meaning": word,
                "source": source,
            })

        # İngilizce girişte önizleme ve kayıt aynı sırayı kullanır:
        # WordBank/CSV -> Gemini -> çeviri API'si.
        result, source = WordBankService.resolve_meaning(word)
        meaning = result["meaning1"]
        if not meaning:
            return Response({"error": "Translation could not be completed."}, status=400)

        return Response({
            "meaning": meaning,
            "source": source,
        })

# burası güncellendi --------------------------------------------------------------------------------------------   
class ReviewSessionView(APIView):

    def get(self, request):
        # 1. Kelimeleri kategorilerine göre veritabanından çek ve listeye çevir
        new_words = list(
            Word.objects.filter(
                user=request.user,
                known_count=0,
                unknown_count=0
            )
        )

        learning_words = []

        known_words = []

        for word in Word.objects.filter(user=request.user).exclude(
            known_count=0,
            unknown_count=0
        ):

            total = word.known_count + word.unknown_count
            trust_point = word.known_count / total

            if trust_point < 0.6:
                learning_words.append(word)
            else:
                known_words.append(word)

        known_words = list(
            Word.objects.filter(
                user=request.user,
                known_count__gt=0,
                unknown_count=0
            )
        )

        # 2. Her kategoriyi kendi içinde karıştır
        random.shuffle(new_words)
        random.shuffle(learning_words)
        random.shuffle(known_words)

        # 3. Öncelikli kelimeleri birleştir ve tekrar karıştır
        priority_words = new_words + learning_words
        random.shuffle(priority_words)

        session = []

        # 4. Kelimeleri 4 öncelikli, 1 bilinen olacak şekilde sırayla listeye diz
        while priority_words or known_words:
            
            # Maksimum 4 tane öncelikli kelime ekle
            for _ in range(4):
                if priority_words:
                    session.append(priority_words.pop())
            
            # Ardından 1 tane bilinen kelime ekle
            if known_words:
                session.append(known_words.pop())

        # 5. Oluşan session listesini JSON formatına dönüştür
        data = []
        for word in session:
            total_reviews = word.known_count + word.unknown_count
            trust_point = round(word.known_count / total_reviews, 2) if total_reviews else 0.0

            data.append({
                "id": word.id,
                "english_word": word.english_word,
                "turkish_meaning": word.turkish_meaning,
                "trust_point": trust_point,
            })

        return Response(data)
    
class ReviewCreateView(APIView):

    def post(self, request):

        word = get_object_or_404(
            Word,
            id=request.data["word_id"],
            user=request.user,
        )

        is_known = request.data["is_known"]

        Review.objects.create(
            word=word,
            is_known=is_known
        )

        if is_known:
            word.known_count += 1
        else:
            word.unknown_count += 1

        word.last_reviewed = timezone.now()
        word.save()

        total_reviews = word.known_count + word.unknown_count
        trust_point = round(word.known_count / total_reviews, 2) if total_reviews else 0.0

        return Response({
            "success": True,
            "trust_point": trust_point,
            "known_count": word.known_count,
            "unknown_count": word.unknown_count,
        })
    
class WordInfoView(APIView):

    def post(self, request):

        word = request.data.get("word")

        if not word:
            return Response(
                {"error": "Word is required"},
                status=400
            )

        try:

            obj = Word.objects.get(
                user=request.user,
                english_word__iexact=word
            )

        except Word.DoesNotExist:

            return Response(
                {"error": "Word not found"},
                status=404
            )

        # Dictionary API bilgileri daha önce çekilmediyse al
        if not obj.definition:

            data = DictionaryService.get_word_info(word)

            if data:

                obj.definition = data.get(
                    "definition",
                    ""
                )

                obj.example = data.get(
                    "example",
                    ""
                )

                obj.phonetic = data.get(
                    "phonetic",
                    ""
                )

                obj.audio_url = data.get(
                    "audio",
                    ""
                )

                obj.save()

        return Response({
            "meaning1": obj.turkish_meaning,
            "meaning2": obj.turkish_meaning2,
            "meaning3": obj.turkish_meaning3,
            "level": obj.level,
            "definition": obj.definition,
            "example": obj.example,
            "phonetic": obj.phonetic,
            "audio": obj.audio_url,
        })
#streak kısmı eklendi--------------------------------------------------------------------------------------------------------
def is_day_completed(user, day):

    added_words = Word.objects.filter(
        user=user,
        created_at__date=day
    ).count()

    reviews = Review.objects.filter(
        word__user=user,
        reviewed_at__date=day
    ).count()

    return (
        added_words >= 1 and
        reviews >= 5
    )


def get_rank(streak):

    if streak >= 365:
        return "Diamond"

    if streak >= 100:
        return "Gold"

    if streak >= 30:
        return "Silver"

    if streak >= 7:
        return "Bronze"

    return "None"
    
class StreakView(APIView):

    def get(self, request):

        today = timezone.localdate()

        today_learned = Word.objects.filter(
            user=request.user,
            created_at__date=today
        ).count()

        today_reviews = Review.objects.filter(
            word__user=request.user,
            reviewed_at__date=today
        ).count()

        streak = 0

        if is_day_completed(request.user, today):
            check_day = today
        else:
            # Bugün henüz tamamlanmadıysa dünden itibaren say,
            # böylece bugün tamamlanana kadar streak sıfırlanmaz.
            check_day = today - timedelta(days=1)

        while is_day_completed(request.user, check_day):

            streak += 1
            check_day -= timedelta(days=1)

        return Response({

            "streak": streak,

            "today_learned": today_learned,

            "today_reviews": today_reviews,

            "goal_completed": (
                today_learned >= 1 and
                today_reviews >= 5
            ),

            "rank": get_rank(streak),

        # ... (next_rank, next_rank_progress aynı kalıyor)
            "next_rank": (
                "Bronze"
                if streak < 7 else
                "Silver"
                if streak < 30 else
                "Gold"
                if streak < 100 else
                "Diamond"
                if streak < 365 else
                "Max"
            ),

            "next_rank_progress":
                min(
                    streak,
                    7
                ) if streak < 7 else
                min(
                    streak - 7,
                    23
                ) if streak < 30 else
                min(
                    streak - 30,
                    70
                ) if streak < 100 else
                min(
                    streak - 100,
                    265
                ) if streak < 365 else
                365,

        })
#streak kısmı eklendi--------------------------------------------------------------------------------------------------------

