# management/commands/backfill_dictionary_info.py
import time
from django.core.management.base import BaseCommand
from words.models import WordBank
from words.services.dictionary_service import DictionaryService


class Command(BaseCommand):
    help = "WordBank içindeki definition/example bilgisi eksik kelimeleri dictionaryapi.dev'den doldurur."

    def handle(self, *args, **options):
        qs = WordBank.objects.filter(dictionary_lookup_done=False)
        total = qs.count()
        self.stdout.write(f"{total} kelime işlenecek.")

        for i, bank in enumerate(qs.iterator(), start=1):
            data = DictionaryService.get_word_info(bank.word)

            if data:
                bank.definition = data.get("definition", "")
                bank.example = data.get("example", "")
                bank.phonetic = data.get("phonetic", "")
                bank.audio_url = data.get("audio", "")

            bank.dictionary_lookup_done = True
            bank.save(update_fields=[
                "definition", "example", "phonetic", "audio_url", "dictionary_lookup_done"
            ])

            if i % 20 == 0:
                self.stdout.write(f"{i}/{total} tamamlandı")

            time.sleep(0.3)  # dış API'yi yormamak için