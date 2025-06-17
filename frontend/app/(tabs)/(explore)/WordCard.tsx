import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import CustomText from "@/components/CustomText";

export default function WordCard({ word, definition, learned, onPress }) {
  const playSound = () => {
    Speech.speak(word);
  };
  // console.log("learned: ", learned);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable onPress={onPress}>
        <View style={[styles.card, styles.cardNotLearned]}>
          <View style={styles.info}>
            <View style={styles.row}>
              <CustomText style={styles.word}>
                {word}{" "}
                {learned && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#4CAF50"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </CustomText>

              <Pressable onPress={playSound}>
                <Ionicons name="volume-high" size={20} color="#FF6F61" />
              </Pressable>
            </View>
            <CustomText style={styles.definition}>{definition}</CustomText>
          </View>
        </View>
      </Pressable>
    </ScrollView>
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
  cardNotLearned: {
    backgroundColor: "#FFF", // white or light gray
  },
});
