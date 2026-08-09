import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { changePassword, deleteAccount, logout } from "../services/authService";

export default function ProfileScreen({ navigation, onLogout }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Eksik bilgi", "Mevcut şifreyi ve yeni şifreyi girin.");
      return;
    }

    try {
      setPasswordLoading(true);
      await changePassword(currentPassword, newPassword);
      Alert.alert("Başarılı", "Şifre başarıyla değiştirildi.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      const detail = error.response?.data?.error || "Şifre değiştirilemedi.";
      Alert.alert("Hata", detail);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert("Hesabı sil", "Hesabınızı silmek istediğinizden emin misiniz? Onay e-postası gönderilecek.", [
      { text: "İptal", style: "cancel" },
      { text: "Evet", style: "destructive", onPress: async () => {
        try {
          setDeleteLoading(true);
          await deleteAccount(currentPassword);
          await logout();
          onLogout?.();
          Alert.alert("Oturum kapatıldı", "Hesap silme onayı için e-posta gönderildi. Oturum kapatıldı, giriş ekranına yönlendirildin.");
        } catch (error) {
          const detail = error.response?.data?.error || "Hesap silinemedi.";
          Alert.alert("Hata", detail);
        } finally {
          setDeleteLoading(false);
        }
      } }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.subtitle}>Şifre değiştir ve hesabını sil.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Şifre değiştir</Text>
        <TextInput
          style={styles.input}
          placeholder="Mevcut şifre"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Yeni şifre"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleChangePassword} disabled={passwordLoading}>
          <Text style={styles.buttonText}>{passwordLoading ? "Gönderiliyor..." : "Şifreyi değiştir"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount} disabled={deleteLoading}>
        <Text style={styles.deleteButtonText}>{deleteLoading ? "İşleniyor..." : "Hesabı sil"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Geri dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F5EFE6" },
  title: { fontSize: 28, fontWeight: "700", color: "#111827", marginTop: 24 },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 6, marginBottom: 20 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#111827" },
  input: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 12, padding: 12, marginBottom: 10 },
  primaryButton: { backgroundColor: "#111827", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 4 },
  buttonText: { color: "#fff", fontWeight: "700" },
  deleteButton: { backgroundColor: "#DC2626", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 8 },
  deleteButtonText: { color: "#fff", fontWeight: "700" },
  linkButton: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#3730A3", fontWeight: "600" },
});
