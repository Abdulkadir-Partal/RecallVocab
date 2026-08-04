from rest_framework import serializers
from .models import Word, Review


class WordSerializer(serializers.ModelSerializer):

    trust_point = serializers.SerializerMethodField()

    class Meta:
        model = Word
        fields = [
            "id",
            "english_word",

            "turkish_meaning",
            "turkish_meaning2",
            "turkish_meaning3",
            "level",

            "created_at",
            "known_count",
            "unknown_count",
            "last_reviewed",
            "trust_point",
        ]

    def get_trust_point(self, obj):

        total = obj.known_count + obj.unknown_count

        if total == 0:
            return 0.0

        return round(
            obj.known_count / total,
            2
        )

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

