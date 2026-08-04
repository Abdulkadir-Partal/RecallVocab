from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import uuid


class Word(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="words",
        null=True,
        blank=True,
    )

    word_bank = models.ForeignKey(
        "WordBank",
        on_delete=models.SET_NULL,
        related_name="learner_words",
        null=True,
        blank=True,
    )

    english_word = models.CharField(
        max_length=100,
        # Aynı kaynak kelime farklı kullanıcıların listesinde bulunabilir.
    )

    # Ana anlam (mevcut sistem bunu kullanmaya devam edecek)
    turkish_meaning = models.TextField()

    # Ek anlamlar
    turkish_meaning2 = models.TextField(
        blank=True,
        default=""
    )

    turkish_meaning3 = models.TextField(
        blank=True,
        default=""
    )

    # CEFR seviyesi
    level = models.CharField(
        max_length=5,
        blank=True,
        default=""
    )

    # Dictionary API
    example = models.TextField(
        blank=True,
        default=""
    )

    definition = models.TextField(
        blank=True,
        default=""
    )

    phonetic = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    audio_url = models.URLField(
        blank=True,
        default=""
    )

    known_count = models.IntegerField(default=0)

    unknown_count = models.IntegerField(default=0)

    last_reviewed = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.english_word} ({self.level})"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "english_word"],
                name="unique_user_english_word",
            )
        ]


class Review(models.Model):

    word = models.ForeignKey(
        Word,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    is_known = models.BooleanField()

    reviewed_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.word.english_word} - {self.is_known}"

class LevelProgress(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="level_progress",
        null=True,
        blank=True,
    )

    LEVEL_CHOICES = [
        ("A1", "A1"),
        ("A2", "A2"),
        ("B1", "B1"),
        ("B2", "B2"),
        ("C1", "C1"),
        ("C2", "C2"),
    ]

    current_level = models.CharField(
        max_length=2,
        choices=LEVEL_CHOICES,
        default="A1",
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.current_level

class WordBank(models.Model):
    word = models.CharField(max_length=100, unique=True, db_index=True)
    meaning1 = models.CharField(max_length=255, blank=True)
    meaning2 = models.CharField(max_length=255, blank=True)
    meaning3 = models.CharField(max_length=255, blank=True)
    level = models.CharField(max_length=10, blank=True)
    source = models.CharField(
        max_length=10,
        choices=[("csv", "csv"), ("gemini", "gemini"), ("api", "api")],
        default="csv",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.word


class EmailVerificationToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verification_tokens",
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def create_for_user(cls, user):
        return cls.objects.create(
            user=user,
            expires_at=timezone.now() + timedelta(hours=24),
        )

    def is_valid(self):
        return self.used_at is None and self.expires_at > timezone.now()
