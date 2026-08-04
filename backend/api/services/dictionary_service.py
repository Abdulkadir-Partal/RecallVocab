import requests


class DictionaryService:

    BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"

    @classmethod
    def get_word_info(cls, word):

        response = requests.get(
            cls.BASE_URL + word.lower()
        )

        if response.status_code != 200:
            return None

        data = response.json()[0]

        definition = ""
        example = ""
        phonetic = ""
        audio = ""

        # Pronunciation
        phonetic = data.get("phonetic", "")

        for p in data.get("phonetics", []):

            if p.get("text") and not phonetic:
                phonetic = p["text"]

            if p.get("audio"):
                audio = p["audio"]
                break

        # Definition + Example
        for meaning in data.get("meanings", []):

            for d in meaning.get("definitions", []):

                if not definition:
                    definition = d.get("definition", "")

                if d.get("example"):
                    example = d["example"]
                    break

            if example:
                break

        return {
            "definition": definition,
            "example": example,
            "phonetic": phonetic,
            "audio": audio,
        }