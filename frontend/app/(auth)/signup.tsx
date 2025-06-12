import * as React from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Appbar,
} from "react-native-paper";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:5130/api/auth";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const onSignup = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Registration failed");
      setLoading(false);
      router.replace("/(auth)/login" as any);
    } catch (e) {
      setLoading(false);
      setError("Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sign Up" />
      </Appbar.Header>

      <View style={styles.form}>
        <Text variant="headlineMedium" style={{ marginBottom: 24 }}>
          Create Account
        </Text>
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ marginBottom: 12 }}
        />
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ marginBottom: 12 }}
        />
        <TextInput
          label="Confirm Password"
          mode="outlined"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={{ marginBottom: 12 }}
        />
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
        <Button
          mode="contained"
          loading={loading}
          onPress={onSignup}
          style={{ marginBottom: 12 }}
        >
          Sign Up
        </Button>
        <Button mode="text" onPress={() => router.back()}>
          Already have an account? Log in
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
});
