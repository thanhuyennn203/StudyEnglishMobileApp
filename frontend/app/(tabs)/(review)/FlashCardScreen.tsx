import CustomText from "@/components/CustomText";
import { Baloo2_600SemiBold, useFonts } from "@expo-google-fonts/baloo-2";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  Image,
} from "react-native";
import {
  Button,
  Card,
  ProgressBar,
  MD3Colors,
  Appbar,
} from "react-native-paper";
import ModalNotification from "@/components/ModalNotification";
import { API_URL } from "../../../GetIp";
import { flashcardImages } from "../../../flashcardImages";

export default function FlashCardScreen() {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [word, setWord] = useState([]);
  const { topicId, topicName } = useLocalSearchParams();
  const [isComplete, setIsComplete] = useState(false);
  const DEFAULT_IMAGE_URL = require("@/assets/images/flashcards/default.jpg");
  const [image, setImage] = useState(DEFAULT_IMAGE_URL);

  const fetchImage = async (spelling) => {
    const key = spelling.toLowerCase();
    const image = flashcardImages[key];
    if (image) {
      setImage(image);
    }
  };

  const playSound = (word) => {
    if (word) Speech.speak(word);
  };

  useEffect(() => {
    const url = API_URL + `/Words/by-topic/${topicId}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => setWord(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    if (word.length > 0 && word[currentIndex]?.spelling) {
      fetchImage(word[currentIndex].spelling);
    }
  }, [word, currentIndex]);

  const [fontsLoaded] = useFonts({ Baloo2_600SemiBold });
  if (!fontsLoaded) return null;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start();
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (currentIndex < word.length - 1) {
      setFlipped(false);
      flipAnim.setValue(0);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    setFlipped(false);
    flipAnim.setValue(0);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const item =
    word.length > 0
      ? word[currentIndex]
      : { spelling: "", ipa: "", defination: "" };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={topicName} />
      </Appbar.Header>
      <ProgressBar
        progress={word.length > 0 ? (currentIndex + 1) / word.length : 0}
        color={MD3Colors.primary40}
        style={styles.progressBar}
      />
      {word.length === 0 ? (
        <CustomText style={{ textAlign: "center", marginTop: 40 }}>
          Loading words...
        </CustomText>
      ) : (
        <>
          <Pressable onPress={flipCard}>
            <View style={styles.cardContainer}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [{ rotateY: frontInterpolate }],
                    zIndex: flipped ? 0 : 1,
                  },
                ]}
              >
                <Card style={styles.innerCard}>
                  <Image source={image} style={styles.image} />

                  {/* <Card.Cover
                    style={styles.image}
                    source={{ uri: "https://picsum.photos/300" }}
                  /> */}
                </Card>
              </Animated.View>

              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [{ rotateY: backInterpolate }],
                    zIndex: flipped ? 1 : 0,
                  },
                ]}
              >
                <Card style={[styles.innerCard, styles.backCard]}>
                  <Card.Content style={styles.cardContent}>
                    <CustomText style={styles.cardText}>
                      {item.spelling}
                    </CustomText>
                    {/* <CustomText style={styles.apiText}>/{item.ipa}/</CustomText> */}
                    {/* <CustomText style={styles.apiText}>
                      {item.defination}
                    </CustomText> */}
                  </Card.Content>
                </Card>
              </Animated.View>
            </View>
          </Pressable>

          <MaterialCommunityIcons
            name="volume-high"
            size={40}
            onPress={() => playSound(item.spelling)}
            style={{ alignSelf: "center", marginTop: 20 }}
          />

          <View style={styles.buttonRow}>
            <Button
              style={{ flex: 1, marginRight: 5 }}
              buttonColor="#FFB74D"
              onPress={handlePrevious}
            >
              <CustomText>Previous</CustomText>
            </Button>
            <Button
              style={{ flex: 1, marginLeft: 5 }}
              buttonColor="#4DB6AC"
              onPress={handleNext}
            >
              <CustomText>Next</CustomText>
            </Button>
          </View>
        </>
      )}

      <ModalNotification
        visible={isComplete}
        onClose={() => {
          setIsComplete(false);
          router.back();
        }}
        message="🎉 You've completed all the words!"
        imageSource={require("@/assets/images/ads.jpg")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: "#F9F9F9",
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4A90E2",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    borderRadius: 50,
  },
  topicName: { fontSize: 25, textAlign: "center", color: "#FF6F00" },
  progressBar: {
    height: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContainer: {
    width: 340,
    height: 360,
    alignSelf: "center",
    transform: [{ perspective: 1000 }],
    marginTop: 20,
  },
  card: {
    position: "absolute",
    width: 340,
    height: 360,
    backfaceVisibility: "hidden",
  },
  innerCard: { flex: 1, borderRadius: 20, overflow: "hidden", elevation: 5 },
  backCard: {
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  cardText: { fontSize: 36, color: "#2F4F4F", textAlign: "center" },
  apiText: { fontSize: 16, color: "#2F4F4F" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 10,
  },
});
