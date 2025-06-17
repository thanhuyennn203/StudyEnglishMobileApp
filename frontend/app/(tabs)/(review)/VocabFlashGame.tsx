import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import { useAuth } from "../../../hooks/useAuth";
import { ProgressBar } from "react-native-paper";
import Svg, { Circle } from "react-native-svg";
import { API_URL } from "@/GetIp";
import { flashcardImages } from "../../../flashcardImages";

export default function VocabFlashGame() {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(null);
  const [countdown, setCountdown] = useState(4);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introCount, setIntroCount] = useState(4);
  const [introStarted, setIntroStarted] = useState(false);

  const DEFAULT_IMAGE_URL = require("@/assets/images/flashcards/default.jpg");
  const [image, setImage] = useState(DEFAULT_IMAGE_URL);
  const [imageLoaded, setImageLoaded] = useState(false); // Track image load

  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id;
  // console.log(userId);

  const [imageIndex, setImageIndex] = useState(0);
  const fetchImage = async (spelling) => {
    setImageLoaded(false);
    const key = spelling.toLowerCase();
    const img = flashcardImages[key];
    setImage(img || DEFAULT_IMAGE_URL);
    setImageLoaded(true);
  };

  const currentWord = index !== null ? words[index] : null;

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      staysActiveInBackground: false,
    });
  }, []);

  const playSound = async (file) => {
    try {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (err) {
      console.error("Audio play error:", err);
    }
  };

  const playClap = () => {
    playSound(require("../../../assets/sounds/clap.mp3"));
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const topicRes = await fetch(
          `${API_URL}/Topic/CompletedByUser/${userId}`
        );
        const topics = await topicRes.json();
        const allWords = [];

        for (const topic of topics) {
          const res = await fetch(`${API_URL}/Words/by-topic/${topic.id}`);
          const topicWords = await res.json();
          allWords.push(...topicWords);
        }

        setWords(allWords.slice(0, 10));
      } catch (err) {
        // console.error("Error fetching words:", err);

        Alert.alert(
          "Notice",
          "You have not completed any topics!",
          [
            {
              text: "OK",
              onPress: () => router.back(), // Go back only when user clicks OK
            },
          ],
          { cancelable: false }
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, []);

  useEffect(() => {
    if (!isLoading && words.length > 0 && !introStarted) {
      setIntroStarted(true);
      setShowIntro(true);
      playSound(require("../../../assets/sounds/go.mp3"));

      let steps = ["3", "2", "1", "GO!"];
      steps.forEach((step, i) => {
        setTimeout(() => setIntroCount(step), (i + 1) * 1000);
      });

      setTimeout(() => {
        setShowIntro(false);
        setIndex(0);
      }, steps.length * 1000 + 500);
    }
  }, [isLoading, words, introStarted]);

  useEffect(() => {
    if (index !== null && currentWord) {
      fetchImage(currentWord.spelling);
    }
  }, [index]);

  useEffect(() => {
    if (index === null || !currentWord || !imageLoaded) return;

    setCountdown(4);
    setShowAnswer(false);
    playSound(require("../../../assets/sounds/whatisitcalled.mp3"));

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setShowAnswer(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [index, imageLoaded]);

  useEffect(() => {
    if (showAnswer) {
      const timeout = setTimeout(() => {
        if (index < 9) {
          setIndex(index + 1);
          setImageIndex((prev) => (prev + 1) % 2);
        } else {
          setShowCongrats(true);
          playClap();
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showAnswer]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading words...</Text>
      </View>
    );
  }

  if (!isLoading && words.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No learned words found.</Text>
      </View>
    );
  }

  const radius = 40;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = countdown / 4;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <View style={styles.progressHeader}>
        {words.map((_, i) => (
          <Text
            key={i}
            style={i <= index ? styles.dotActive : styles.dotInactive}
          >
            {i <= index ? "●" : "○"}
          </Text>
        ))}
      </View>

      <Text style={styles.wordCountText}>
        Word {index !== null ? index + 1 : 0} of {words.length}
      </Text>

      <Text style={styles.question}>What is this called?</Text>

      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={styles.image}
          onLoad={() => setImageLoaded(true)}
        />
      </View>

      {!showAnswer && (
        <View style={styles.countdownCircle}>
          <Svg height="100" width="100">
            <Circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#000"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - circumference * progress}
            />
          </Svg>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      {showAnswer && (
        <View style={styles.answerBox}>
          <Text style={styles.word}>{currentWord.spelling}</Text>
          <Text style={styles.meaning}>{currentWord.meaning}</Text>
        </View>
      )}

      {showIntro && (
        <View style={styles.overlay}>
          <Text style={styles.introText}>{introCount}</Text>
        </View>
      )}

      <Modal visible={showCongrats} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 26, fontWeight: "bold" }}>
              🎉 Congratulations!
            </Text>
            <Text style={{ fontSize: 18, marginTop: 10 }}>
              You completed 10 words!
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.okBtn}
            >
              <Text style={{ fontSize: 18, color: "#fff" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CBE9F9",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  backBtn: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
  },
  question: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  wordCountText: {
    fontSize: 16,
    marginBottom: 69,
    color: "#000",
  },
  imageContainer: {
    width: 350,
    height: 350,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  countdownCircle: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  countdownText: {
    position: "absolute",
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  answerBox: {
    alignItems: "center",
    marginTop: 20,
  },
  word: { fontSize: 32, fontWeight: "bold", color: "#000" },
  meaning: { fontSize: 20, marginTop: 10, color: "#000" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  okBtn: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  introText: {
    fontSize: 72,
    color: "#fff",
    fontWeight: "bold",
  },
  progressHeader: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  dotActive: {
    fontSize: 20,
    color: "#000",
    marginHorizontal: 3,
  },
  dotInactive: {
    fontSize: 20,
    color: "#DDD",
    marginHorizontal: 3,
  },
});
