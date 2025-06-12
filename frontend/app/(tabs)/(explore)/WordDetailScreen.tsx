import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_IMAGE_URL =
  "https://cdn-icons-png.flaticon.com/512/190/190411.png";

export default function WordDetailScreen() {
  const { word, image } = useLocalSearchParams();
  const router = useRouter();

  const [learned, setLearned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [definitionData, setDefinitionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkLearned();
    fetchDefinition();
  }, []);

  const fetchDefinition = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setDefinitionData(data[0]);
        setError(null);
      } else {
        setError("No definitions found.");
      }
    } catch (err) {
      setError("Failed to fetch definition.");
    } finally {
      setLoading(false);
    }
  };

  const checkLearned = async () => {
    const stored = await AsyncStorage.getItem("learnedWords");
    if (stored) {
      const list = JSON.parse(stored);
      if (list.includes(word)) setLearned(true);
    }
  };

  const markAsLearned = async () => {
    const stored = await AsyncStorage.getItem("learnedWords");
    let list = stored ? JSON.parse(stored) : [];

    if (!list.includes(word)) {
      list.push(word);
      await AsyncStorage.setItem("learnedWords", JSON.stringify(list));
      setLearned(true);
      Alert.alert("Marked as finished!");
    }
  };

  const playSound = () => {
    if (word) Speech.speak(word);
  };

  const renderDefinitions = () => {
    if (!definitionData?.meanings) return null;
    return definitionData.meanings.map((meaning, idx) => (
      <View key={idx} style={styles.definitionBlock}>
        <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
        {meaning.definitions.map((def, i) => (
          <Text key={i} style={styles.definition}>
            • {def.definition}
          </Text>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#444" />
        </TouchableOpacity>
      </SafeAreaView>

      <Image
        source={{ uri: image || DEFAULT_IMAGE_URL }}
        style={styles.image}
      />

      <View style={styles.wordRow}>
        <Text style={styles.word}>{word}</Text>
        <TouchableOpacity onPress={playSound} style={styles.soundButton}>
          <Ionicons name="volume-high" size={24} color="#FF6F61" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6F61" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <>
            {definitionData?.phonetic && (
              <Text style={styles.pronunciation}>
                /{definitionData.phonetic}/
              </Text>
            )}
            <Text style={styles.definitionTitle}>Definition</Text>
            {renderDefinitions()}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.learnedBtn, learned && styles.learnedBtnActive]}
        onPress={markAsLearned}
        disabled={learned}
      >
        <Text style={styles.learnedBtnText}>
          {learned ? "Finished" : "Mark as finished"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF7EF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#FFF7EF",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  word: { fontSize: 32, fontWeight: "bold", color: "#333" },
  pronunciation: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginBottom: 10,
  },
  soundButton: {
    marginLeft: 12,
    backgroundColor: "#FFE1E1",
    padding: 10,
    borderRadius: 30,
  },
  definitionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 8,
    textAlign: "center",
  },
  partOfSpeech: {
    fontStyle: "italic",
    color: "#555",
    fontSize: 16,
    marginTop: 10,
  },
  definitionBlock: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  definition: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  learnedBtn: {
    backgroundColor: "#FF6F61",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 10,
  },
  learnedBtnActive: {
    backgroundColor: "#4CAF50",
  },
  learnedBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
