from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import EmailVerificationToken, Word, WordBank
from .services.services_tr import translate_word


class ReviewTrustPointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="test@example.com",
            email="test@example.com",
            password="secure-test-password",
        )
        self.client.force_authenticate(self.user)
        self.word = Word.objects.create(
            user=self.user,
            english_word="test",
            turkish_meaning="test",
            known_count=1,
            unknown_count=1,
        )

    def test_review_updates_trust_point(self):
        response = self.client.post(
            "/api/review/",
            {"word_id": self.word.id, "is_known": True},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.word.refresh_from_db()

        self.assertEqual(self.word.known_count, 2)
        self.assertEqual(self.word.unknown_count, 1)
        self.assertEqual(response.data["trust_point"], 0.67)

    def test_word_list_only_returns_authenticated_users_words(self):
        other_user = get_user_model().objects.create_user(
            username="other@example.com",
            password="secure-test-password",
        )
        Word.objects.create(
            user=other_user,
            english_word="private",
            turkish_meaning="özel",
        )

        response = self.client.get("/api/words/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([word["english_word"] for word in response.data], ["test"])


class TranslationServiceTests(TestCase):
    @patch("api.services.services_tr.requests.get")
    def test_translate_word_supports_turkish_to_english(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "responseData": {"translatedText": "hello"}
        }

        result = translate_word("merhaba", source_language="tr")

        self.assertEqual(result, "hello")
        mock_get.assert_called_once()
        self.assertIn("langpair=tr|en", mock_get.call_args[0][0])


class WordPreviewAndSaveTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="preview@example.com",
            password="secure-test-password",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        WordBank.objects.create(
            word="house",
            meaning1="ev",
            meaning2="konut",
            level="A1",
            source="csv",
        )

    def test_english_preview_and_saved_word_use_word_bank_meaning(self):
        preview = self.client.post(
            "/api/translate/", {"word": "house", "direction": "en_to_tr"}, format="json"
        )
        saved = self.client.post(
            "/api/words/add/", {"word": "house", "direction": "en_to_tr"}, format="json"
        )

        self.assertEqual(preview.status_code, 200)
        self.assertEqual(saved.status_code, 201)
        self.assertEqual(preview.data["meaning"], "ev")
        self.assertEqual(saved.data["turkish_meaning"], preview.data["meaning"])


class EmailVerificationTests(TestCase):
    @patch("api.views.send_mail")
    def test_user_must_verify_email_before_login(self, mocked_send_mail):
        email = "verify@example.com"
        password = "secure-test-password"

        register = self.client.post(
            "/api/auth/register/", {"email": email, "password": password}, format="json"
        )

        self.assertEqual(register.status_code, 201)
        mocked_send_mail.assert_called_once()
        user = get_user_model().objects.get(username=email)
        self.assertFalse(user.is_active)
        self.assertEqual(
            self.client.post("/api/auth/login/", {"username": email, "password": password}, format="json").status_code,
            401,
        )

        verification = EmailVerificationToken.objects.get(user=user)
        verified = self.client.get(reverse("verify-email", kwargs={"token": verification.token}))
        self.assertEqual(verified.status_code, 200)

        login = self.client.post(
            "/api/auth/login/", {"username": email, "password": password}, format="json"
        )
        self.assertEqual(login.status_code, 200)
        self.assertIn("access", login.data)


class AccountSettingsEmailConfirmationTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="settings@example.com",
            email="settings@example.com",
            password="secure-test-password",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    @patch("api.views.send_mail")
    def test_password_change_is_immediate_without_email_confirmation(self, mocked_send_mail):
        response = self.client.post(
            "/api/auth/change-password/",
            {"current_password": "secure-test-password", "new_password": "new-strong-password"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        mocked_send_mail.assert_not_called()
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("new-strong-password"))
        self.assertFalse(self.user.account_action_tokens.filter(action="password_change").exists())

    @patch("api.views.send_mail")
    def test_delete_account_requires_email_confirmation(self, mocked_send_mail):
        response = self.client.post(
            "/api/auth/delete-account/",
            {"password": "secure-test-password"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        mocked_send_mail.assert_called_once()

        token = self.user.account_action_tokens.get(action="delete_account")
        confirm_response = self.client.get(reverse("confirm-delete-account", kwargs={"token": token.token}))

        self.assertEqual(confirm_response.status_code, 200)
        self.assertFalse(get_user_model().objects.filter(pk=self.user.pk).exists())
