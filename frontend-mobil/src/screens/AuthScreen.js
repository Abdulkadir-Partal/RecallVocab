import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaskedPasswordInput from "../components/MaskedPasswordInput";
import { login, register } from "../services/authService";

export default function AuthScreen({ onAuthenticated }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!username.trim() || password.length < 8) {
      Alert.alert("Eksik bilgi", "Geçerli bir kullanıcı adı ve en az 8 karakterlik parola girin.");
      return;
    }
    try {
      setLoading(true);
      if (isRegistering) {
        await register(username, password);
        Alert.alert("Kayıt başarılı", "Hesabınız oluşturuldu. Giriş yapabilirsiniz.");
        setIsRegistering(false);
      } else {
        await login(username, password);
        onAuthenticated();
      }
    } catch (error) {
      const detail = error.response?.data?.error || error.response?.data?.detail || "İşlem tamamlanamadı. Bilgilerinizi ve bağlantınızı kontrol edin.";
      Alert.alert("Giriş yapılamadı", detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RecallWord</Text>
      <Text style={styles.subtitle}>{isRegistering ? "Hesabını oluştur" : "Hesabına giriş yap"}</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="Kullanıcı adı" />
      <MaskedPasswordInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Parola" />
      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Bekleyin..." : isRegistering ? "Kayıt ol" : "Giriş yap"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegistering((value) => !value)}>
        <Text style={styles.link}>{isRegistering ? "Zaten hesabın var mı? Giriş yap" : "Hesabın yok mu? Kayıt ol"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F5EFE6" },
  title: { fontSize: 32, fontWeight: "700", color: "#111827", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6B7280", marginBottom: 28 },
  input: { backgroundColor: "#fff", borderColor: "#CACCC0", borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: "#111827", borderRadius: 14, alignItems: "center", padding: 15, marginTop: 4 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  link: { color: "#3730A3", textAlign: "center", marginTop: 20, fontWeight: "600" },
});
