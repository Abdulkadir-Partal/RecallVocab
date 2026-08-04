import pandas as pd
from pathlib import Path
from django.core.management.base import BaseCommand
from api.models import WordBank


class Command(BaseCommand):
    help = "CSV'deki kelimeleri WordBank tablosuna toplu (bulk) olarak aktarır."

    def handle(self, *args, **options):
        backend_dir = Path(__file__).resolve().parents[3]
        csv_path = backend_dir / "data" / "word_bank.csv"

        if not csv_path.exists():
            self.stdout.write(self.style.ERROR(f"CSV bulunamadı: {csv_path}"))
            return

        df = pd.read_csv(csv_path)

        # Zaten Supabase'de olan kelimeleri tek sorguda çek (tekrar eklememek için)
        existing_words = set(
            w.lower() for w in WordBank.objects.values_list("word", flat=True)
        )

        objs = []
        skipped = 0

        for _, row in df.iterrows():
            word = str(row.get("word", "")).strip()

            if not word or word.lower() == "nan" or word.lower() in existing_words:
                skipped += 1
                continue

            objs.append(WordBank(
                word=word,
                meaning1=self._safe(row.get("meaning1")),
                meaning2=self._safe(row.get("meaning2")),
                meaning3=self._safe(row.get("meaning3")),
                level=self._safe(row.get("level")),
                source="csv",
            ))

            existing_words.add(word.lower())

        WordBank.objects.bulk_create(objs, batch_size=500)

        self.stdout.write(self.style.SUCCESS(
            f"Bitti. Eklenen: {len(objs)}, atlanan: {skipped}"
        ))

    @staticmethod
    def _safe(value):
        if value is None or (isinstance(value, float) and pd.isna(value)):
            return ""
        return str(value)