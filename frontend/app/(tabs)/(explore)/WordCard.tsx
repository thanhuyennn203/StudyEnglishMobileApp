import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function WordCard({ word, definition, onPress }) {
  const [learned, setLearned] = useState(false);

  useEffect(() => {
    checkLearned();
  }, []);

  const checkLearned = async () => {
    const stored = await AsyncStorage.getItem("learnedWords");
    if (stored) {
      const list = JSON.parse(stored);
      if (list.includes(word)) setLearned(true);
    }
  };

  const playSound = () => {
    Speech.speak(word);
  };

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.card, learned && styles.cardLearned]}>
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.word}>{word}</Text>
            <Pressable onPress={playSound}>
              <Ionicons name="volume-high" size={20} color="#FF6F61" />
            </Pressable>
          </View>
          <Text style={styles.definition}>{definition}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cardLearned: {
    backgroundColor: "#E0F5E9", // xanh lá nhạt
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  definition: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
