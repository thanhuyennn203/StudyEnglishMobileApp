import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  Pressable,
  View,
  Dimensions,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { useFonts, Baloo2_600SemiBold } from "@expo-google-fonts/baloo-2";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomText from "@/components/CustomText";
import { Audio } from "expo-av";
import * as Progress from "react-native-progress";

const { width } = Dimensions.get("window");

const FlashCardScreen = () => {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [word, setWord] = useState([]);
  const { topicId, topicName } = useLocalSearchParams();

  useEffect(() => {
    const url = "http://localhost:5130/api/Words/by-topic/" + topicId;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => {
        setWord(data);
        console.log(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []); // FIX: remove `word` from dependency array

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
  if (!fontsLoaded || word.length === 0) return null;

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
    setFlipped(false);
    flipAnim.setValue(0);
    setCurrentIndex((prev) => Math.min(prev + 1, word.length - 1));
  };

  const handlePrevious = () => {
    setFlipped(false);
    flipAnim.setValue(0);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const item = word[currentIndex];

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="arrow-left-bold-circle"
        style={styles.backBtn}
        onPress={() => router.back()}
        size={48}
        color="#FFD700"
      />
      <View style={styles.progressCircle}>
        <Progress.Circle
          progress={(currentIndex + 1) / word.length}
          size={60}
          showsText={true}
          formatText={() => `${word.length - currentIndex - 1}`}
          color="#FF6F00"
          borderWidth={2}
          thickness={6}
          unfilledColor="#FFE0B2"
          textStyle={{ color: "#FF6F00", fontWeight: "bold" }}
        />
      </View>

      <CustomText style={styles.level}>LEVEL 1</CustomText>
      <CustomText style={styles.topicName}>{topicName}</CustomText>

      <View style={styles.content}>
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
          color="#64B5F6"
          onPress={playSound}
          style={{ alignSelf: "center", marginTop: 20 }}
        />
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  content: { alignItems: "center", paddingTop: 20 },
  backBtn: {
    position: "absolute",
    top: 62,
    left: 20,
    zIndex: 10,
    borderRadius: 50,
  },
  level: {
    fontSize: 30,
    textAlign: "center",
    color: "#FF6F00",
    marginBottom: -15,
  },
  topicName: { fontSize: 25, textAlign: "center", color: "#FF6F00" },
  cardContainer: {
    width: 320,
    height: 400,
    alignSelf: "center",
    perspective: 1000,
    marginTop: 20,
  },
  card: {
    position: "absolute",
    width: 320,
    height: 400,
    backfaceVisibility: "hidden",
  },
  innerCard: { flex: 1, borderRadius: 20, overflow: "hidden", elevation: 5 },
  backCard: {
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  cardText: { fontSize: 60, color: "#2F4F4F", textAlign: "center" },
  apiText: { fontSize: 25, color: "#2F4F4F" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 10,
  },
  progressCircle: { position: "absolute", top: 60, right: 20 },
});

export default FlashCardScreen;
