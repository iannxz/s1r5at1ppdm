import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api/api";

type Props = {
  onLogin: (token: string) => void;
};

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha o email e a senha.");
      return;
    }
    setCarregando(true);
    try {
      const response = await api.post("/login", { email: email.trim().toLowerCase(), senha });
      onLogin(response.data.token);
    } catch (error: any) {
      const msg = error?.response?.data?.error ?? "Não foi possível conectar ao servidor.";
      Alert.alert("Acesso negado", msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <View style={styles.headerArea}>
          <Text style={styles.appTitle}>StockFlow</Text>
          <Text style={styles.appSubtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="admin@admin.com"
            placeholderTextColor="#C7C7CC"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>SENHA</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••••"
            placeholderTextColor="#C7C7CC"
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btnEntrar, carregando && styles.btnDesabilitado]}
            onPress={entrar}
            activeOpacity={0.85}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.txtBtnEntrar}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.hintBox}>
            <Text style={styles.hintTitulo}>Credenciais de acesso</Text>
            <Text style={styles.hintTexto}>Email: admin@admin.com</Text>
            <Text style={styles.hintTexto}>Senha: admin123</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerArea: {
    marginBottom: 36,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 15,
    color: "#8E8E93",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 17,
    color: "#1C1C1E",
    marginBottom: 20,
  },
  btnEntrar: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  btnDesabilitado: {
    opacity: 0.6,
  },
  txtBtnEntrar: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  hintBox: {
    marginTop: 20,
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  hintTitulo: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  hintTexto: {
    fontSize: 13,
    color: "#3C3C43",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
