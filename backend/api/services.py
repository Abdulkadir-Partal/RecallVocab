import requests


def translate_word(word):
    url = (
        f"https://api.mymemory.translated.net/get"
        f"?q={word}&langpair=en|tr"
    )

    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        return data["responseData"]["translatedText"]

    return None