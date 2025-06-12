import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";

export default function TestScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace("/(tabs)/(explore)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Congratulations</Text>

      <Image
        source={require("@/assets/images/congra.jpg")}
        style={styles.image}
      />

      <Text style={styles.title}>You've completed all tests</Text>

      <Text style={styles.description}>
        Unlock the next level to continue your journey!
      </Text>

      <Button
        mode="contained"
        onPress={handleContinue}
        style={styles.button}
        contentStyle={{ paddingVertical: 6 }}
      >
        Continue
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#FF6F61",
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7A6BEF", // Matching your theme color
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: "#555", // Subtle gray
    textAlign: "center",
    marginBottom: 30,
  },

  button: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#7A6BEF",
  },
});
