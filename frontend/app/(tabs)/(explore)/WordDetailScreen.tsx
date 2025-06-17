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
import { Animated, Pressable } from "react-native";
import { Appbar, Modal, Portal, ProgressBar } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { API_URL } from "@/GetIp";
import { useAuth } from "../../../hooks/useAuth";
import CustomText from "@/components/CustomText";
import { flashcardImages } from "../../../flashcardImages";

const DEFAULT_IMAGE_URL = require("@/assets/images/flashcards/default.jpg");

export default function WordDetailScreen() {
  const { word, status, wordId, topicId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id;

  const [learned, setLearned] = useState(status === "true");
  const [learnCount, setLearnCount] = useState(status === "true" ? 10 : 0);
  const [loading, setLoading] = useState(true);
  const [definitionData, setDefinitionData] = useState(null);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(DEFAULT_IMAGE_URL);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 40,
    margin: 20,
    borderRadius: 10,
  };

  useEffect(() => {
    fetchDefinition();
    fetchImage();
  }, []);

  const fetchImage = async () => {
    const key = word.toLowerCase();
    const image = flashcardImages[key];
    if (image) {
      setImage(image);
    }
  };

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

  const markAsLearned = () => {
    if (!user) {
      showModal();
      return;
    }

    if (learnCount >= 10) {
      Alert.alert("You've already mastered this word!");
      return;
    }

    playSound();
    const newCount = learnCount + 1;
    setLearnCount(newCount);

    if (newCount === 10) {
      setLearned(true);
      markAsLearnedOnServer();
    }
  };

  const markAsLearnedOnServer = async () => {
    const url = API_URL + "/Words/learned";
    try {
      if (!userId || !wordId) return;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          param_1: parseInt(userId),
          param_2: parseInt(wordId),
        }),
      });

      if (!response.ok) {
        console.error("Failed to mark word as learned.");
      } else {
        await checkIfTopicCompleted();
      }
    } catch (err) {
      console.error("API error:", err);
    }
  };

  const checkIfTopicCompleted = async () => {
    try {
      if (!userId || !topicId) return;

      const response = await fetch(
        `${API_URL}/Topic/check-complete?userId=${userId}&topicId=${topicId}`
      );
      const result = await response.json();

      if (result.isCompleted) {
        Alert.alert(
          "Topic Completed!",
          "You've learned all the words in this topic!"
        );
        await checkIfLevelCompleted();
      }
    } catch (err) {
      console.error("Error checking topic completion:", err);
    }
  };

  const checkIfLevelCompleted = async () => {
    const levelId = user?.currentLevel;
    // console.log(levelId);
    try {
      if (!userId || !topicId) return;

      const response = await fetch(
        `${API_URL}/Level/CheckAllTopicsCompletedInLevel?userId=${userId}&levelId=${levelId}`
      );
      const result = await response.json();
      // console.log("result: ", result);
      if (!result.allCompleted) {
        Alert.alert(
          "Level Completed!",
          "Congratulations! You've completed this level. Moving to the next level."
        );
        user.currentLevel = user.currentLevel + 1;
      }
    } catch (err) {
      console.error("Error checking level completion:", err);
    }
  };

  const playSound = () => {
    if (word) Speech.speak(word);
  };

  const scaleAnim = useState(new Animated.Value(1))[0];

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.6,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderDefinitions = () => {
    if (!definitionData?.meanings?.length) return null;
    const firstMeaning = definitionData.meanings[0];

    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={styles.definitionBlock}
      >
        <Text style={styles.partOfSpeech}>{firstMeaning.partOfSpeech}</Text>
        {firstMeaning.definitions.map((def, i) => (
          <Text key={i} style={styles.definition}>
            • {def.definition}
          </Text>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => router.back()} />
      </Appbar.Header>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("@/assets/images/notavailable.jpg")}
              style={{ width: 120, height: 120, marginBottom: 15 }}
            />
            <CustomText style={{ fontSize: 20, textAlign: "center" }}>
              Let's login to save your study!
            </CustomText>
          </View>
        </Modal>
      </Portal>

      <View style={{ marginVertical: 16 }}>
        <Text style={{ textAlign: "center", marginBottom: 4 }}>
          Progress: {Math.min(learnCount, 10)} / 10
        </Text>
        <ProgressBar
          progress={Math.min(learnCount / 10, 1)}
          color="#FF6F61"
          style={{ height: 12, borderRadius: 10 }}
        />
      </View>

      <Image source={image} style={styles.image} />

      <View style={styles.wordRow}>
        <Text style={styles.word}>{word}</Text>
        <TouchableOpacity onPress={playSound} style={styles.soundButton}>
          <Ionicons name="volume-high" size={24} color="#FF6F61" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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

      <View style={styles.fabWrapper}>
        <Animated.View
          style={[styles.fab, { transform: [{ scale: scaleAnim }] }]}
        >
          <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={markAsLearned}
            style={({ pressed }) => [
              {
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 40,
              },
              pressed && { opacity: 0.8 },
            ]}
          >
            <MaterialIcons name="check-circle" size={40} color="#fff" />
          </Pressable>
        </Animated.View>
        <Text style={styles.countText}>{learnCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFF7EF",
    paddingBottom: 30,
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
    marginVertical: 15,
  },
  word: { fontSize: 32, fontWeight: "bold", color: "#333" },
  pronunciation: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
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
    height: 180,
    backgroundColor: "white",
    borderRadius: 10,
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
  fabWrapper: {
    position: "relative",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "#FF6F61",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  countText: {
    marginTop: 20,
    fontSize: 18,
    color: "#FF6F61",
  },
});
