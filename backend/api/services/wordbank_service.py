from ..models import WordBank
from .gemini_service import GeminiService
from .services_tr import translate_word

class WordBankService:

    @classmethod
    def find_word(cls, word):
        try:
            row = WordBank.objects.get(word__iexact=word)
        except WordBank.DoesNotExist:
            return None

        return {
            "word": row.word,
            "meaning1": row.meaning1,
            "meaning2": row.meaning2,
            "meaning3": row.meaning3,
            "level": row.level,
        }

    @classmethod
    def save_word(cls, word, meaning1="", meaning2="", meaning3="", level="", source="gemini"):
        obj, _ = WordBank.objects.update_or_create(
            word=word,
            defaults={
                "meaning1": meaning1,
                "meaning2": meaning2,
                "meaning3": meaning3,
                "level": level,
                "source": source,
            },
        )
        return obj

    @classmethod
    def get_words_by_level(cls, level, exclude_words=None, limit=10):
        exclude_words = set(w.lower() for w in (exclude_words or []))

        qs = WordBank.objects.filter(level__iexact=level).order_by("?")[: limit + len(exclude_words)]

        results = []
        for row in qs:
            if row.word.lower() in exclude_words:
                continue
            results.append({
                "word": row.word,
                "meaning1": row.meaning1,
                "meaning2": row.meaning2,
                "meaning3": row.meaning3,
                "level": row.level,
            })
            if len(results) >= limit:
                break

        return results

    @classmethod
    def resolve_meaning(cls, word):
        """CSV(DB) -> Gemini -> mevcut çeviri API'si sırasıyla dener."""

        # 1. Word bank (eski CSV, şimdi DB tablosu)
        bank = cls.find_word(word)
        if bank:
            return bank, "csv"

        # 2. Gemini
        gemini_result = GeminiService.get_word_meaning(word)
        if gemini_result:
            cls.save_word(
                word=gemini_result["word"],
                meaning1=gemini_result["meaning1"],
                meaning2=gemini_result["meaning2"],
                meaning3=gemini_result["meaning3"],
                level=gemini_result["level"],
                source="gemini",
            )
            return gemini_result, "gemini"

        # 3. Gemini başarısız oldu (limit, network, parse hatası vb) -> mevcut API
        translated = translate_word(word, source_language="en")
        fallback = {
            "word": word,
            "meaning1": translated or "",
            "meaning2": "",
            "meaning3": "",
            "level": "",
        }
        cls.save_word(
            word=word,
            meaning1=fallback["meaning1"],
            source="api",
        )
        return fallback, "api"
