import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Appbar,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, user } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const onLogin = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    const success = await login(email, password);

    if (!success) {
      setError("Invalid email or password.");
    }
  };

  React.useEffect(() => {
    if (user) {
      if (user?.role === "Admin") {
        router.replace("/(admin)");
      } else {
        router.replace("/(tabs)/(profile)");
      }
    }
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="small">
        <Appbar.BackAction
          onPress={() => router.replace("/(tabs)/(profile)")}
        />
        <Appbar.Content title="Login" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Text
          variant="headlineMedium"
          style={{ marginBottom: 24, textAlign: "center" }}
        >
          Log In
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
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
        <Button
          mode="contained"
          loading={loading}
          onPress={onLogin}
          style={{ marginBottom: 12 }}
        >
          Log In
        </Button>
        <Button mode="text" onPress={() => router.push("/(auth)/signup")}>
          Don't have an account? Sign up
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
});
