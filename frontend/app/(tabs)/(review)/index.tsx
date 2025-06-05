import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { useState } from "react";

export default function ReviewScreen() {
  const API_URL = "http://localhost:5130/api"; // Replace with IP if using device
  const [debugText, setDebugText] = useState(""); // State to hold log output

  const getData = async () => {
    try {
      const res = await fetch(`${API_URL}/Topic`); // Fixed double /api
      const json = await res.json();
      console.log(json);
      setDebugText(JSON.stringify(json, null, 2)); // Show result in view
    } catch (err) {
      console.error("Error:", err);
      setDebugText("Error: " + err.message); // Show error in view
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Review Screen!</Text>
      <Button title="Fetch Data" onPress={getData} />
      <ScrollView style={styles.outputBox}>
        <Text>{debugText}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  outputBox: {
    marginTop: 20,
    width: "100%",
    maxHeight: 300,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
});
