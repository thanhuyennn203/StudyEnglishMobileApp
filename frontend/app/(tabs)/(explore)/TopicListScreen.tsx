import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useAuth } from "../../../hooks/useAuth";
import { API_URL } from "../../../GetIp";
import { useFocusEffect } from "@react-navigation/native";

export default function TopicListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultLevelId = 1;
  const paramLevelId = params.levelId ? Number(params.levelId) : null;
  const actualLevelId = paramLevelId || user?.currentLevel || defaultLevelId;
  // console.log(actualLevelId);

  useFocusEffect(
    useCallback(() => {
      if (
        user === undefined ||
        (user !== null && user.currentLevel === undefined && !paramLevelId)
      )
        return;

      const url = API_URL + `/Topic?levelId=${actualLevelId}`;
      setLoading(true);

      // console.log(url);
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch topics");
          return res.json();
        })
        .then((data) => {
          setTopics(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    }, [user])
  );
  console.log(topics);

  return (
    <ScrollView
      style={{
        padding: 16,
        backgroundColor: "#FFFDF6",
        paddingVertical: 50,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
          color: "#FF6F61",
        }}
      >
        🎨 Topics - Level {actualLevelId}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" />
      ) : topics.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#666" }}>
          No topics available.
        </Text>
      ) : (
        topics.map((topic, index) => (
          <Animated.View entering={FadeInRight.delay(index * 100)} key={index}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/WordListScreen",
                  params: { topicId: topic.id, topicName: topic.title },
                })
              }
              style={{
                backgroundColor: ["#FFD6E8", "#C5E8B7", "#FFEAC2", "#BDE0FE"][
                  index % 4
                ],
                marginBottom: 16,
                borderRadius: 20,
                padding: 24,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.15,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>
                {topic.title}
              </Text>
              <Text style={{ fontSize: 14, color: "#555", marginTop: 6 }}>
                {topic.wordNumber} words
              </Text>
            </Pressable>
          </Animated.View>
        ))
      )}
    </ScrollView>
  );
}
