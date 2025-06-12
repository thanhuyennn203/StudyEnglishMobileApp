import CustomText from "@/components/CustomText";
import { Baloo2_600SemiBold, useFonts } from "@expo-google-fonts/baloo-2";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, ProgressBar, MD3Colors } from "react-native-paper";
import ModalNotification from "@/components/ModalNotification";

const { width } = Dimensions.get("window");

export default function FlashCardScreen() {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [word, setWord] = useState([]);
  const { topicId, topicName } = useLocalSearchParams();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const url = `http://localhost:5130/api/Words/by-topic/${topicId}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => setWord(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      });
      setSound(sound);
      await sound.playAsync();
    } catch (e) {
      console.warn("Failed to load sound", e);
    }
  };

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
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="chevron-double-left"
        style={styles.backBtn}
        onPress={() => router.back()}
        size={36}
        color="#4A90E2"
      />
      <CustomText style={styles.header}>{topicName}</CustomText>
      <ProgressBar
        progress={word.length > 0 ? (currentIndex + 1) / word.length : 0}
        color={MD3Colors.primary40}
        style={styles.progressBar}
      />
      <CustomText
        style={{ textAlign: "center", color: "#4e6b78", paddingHorizontal: 10 }}
      >
        <MaterialCommunityIcons
          name="lightbulb-on-outline"
          size={30}
          color="#FF6F00"
        />
        Note: Flip card to see word and press the speaker button to hear the
        pronunciation
      </CustomText>
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
                  <Card.Cover
                    style={styles.image}
                    source={{ uri: "https://picsum.photos/300" }}
                  />
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
                    <CustomText style={styles.apiText}>/{item.ipa}/</CustomText>
                    <CustomText style={styles.apiText}>
                      /{item.defination}/
                    </CustomText>
                  </Card.Content>
                </Card>
              </Animated.View>
            </View>
          </Pressable>

          <MaterialCommunityIcons
            name="volume-high"
            size={40}
            onPress={playSound}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 60,
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
  cardText: { fontSize: 30, color: "#2F4F4F", textAlign: "center" },
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
