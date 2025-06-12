import CustomText from "@/components/CustomText";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { useAuth } from "../../../hooks/useAuth";

const cardColors = ["#A55FEF", "#3AAFFF", "#FD8916", "#45C4B0", "#FCCA38"];

const TakenTopicsScreen = () => {
  const router = useRouter();
  const [topics, setTopics] = useState(null);
  const { user } = useAuth();
  const userId = user?.id;

  // Fetch topics
  useEffect(() => {
    if (!userId) return;

    const url = "http://localhost:5130/api/Topic/CompletedByUser/" + userId;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => {
        if (!data || data.length === 0) {
          setTopics(null);
        } else {
          setTopics(data);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setTopics(null);
      });
  }, [userId]);

  // Assign colors
  const coloredTopics = useMemo(() => {
    if (!topics) return [];
    return topics.map((topic, index) => ({
      ...topic,
      color: cardColors[index % cardColors.length],
    }));
  }, [topics]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <CustomText style={styles.header}>My Progress</CustomText>

      {topics === null ? (
        <View style={styles.noTopicsContainer}>
          <Image
            source={require("@/assets/images/notavailablenow.jpg")}
            style={styles.noTopicsImage}
            resizeMode="contain"
          />
          <CustomText style={styles.noTopicsText}>
            You have not completed any topics.{"\n"}Or maybe the connection was
            interupted!
          </CustomText>
          <Button
            mode="contained"
            onPress={() => router.replace("/(tabs)/(explore)")}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
          >
            STUDY NOW
          </Button>
        </View>
      ) : (
        coloredTopics.map((topic, index) => {
          const scale = new Animated.Value(1);

          const onPressIn = () => {
            Animated.spring(scale, {
              toValue: 0.97,
              useNativeDriver: true,
            }).start();
          };

          const onPressOut = () => {
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          };

          return (
            <Pressable
              key={index}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() =>
                router.push({
                  pathname: "/FlashCardScreen",
                  params: { topicId: topic.id, topicName: topic.title },
                })
              }
            >
              <Animated.View
                style={[
                  styles.topicCard,
                  { backgroundColor: topic.color, transform: [{ scale }] },
                ]}
              >
                <Image
                  source={require("@/assets/images/game_banner_1.jpg")}
                  style={styles.topicImg}
                />
                <Card.Content style={{ flex: 1 }}>
                  <CustomText style={styles.topicTitle}>
                    {topic.title}
                  </CustomText>
                  <CustomText style={styles.topicSubtitle}>
                    {topic.wordNumber} words
                  </CustomText>
                </Card.Content>
                <Button
                  icon="play-circle"
                  onPress={() => {}}
                  textColor="#FFFFFF"
                  labelStyle={{ fontSize: 45 }}
                  children={undefined}
                  style={styles.playIcon}
                />
              </Animated.View>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingTop: 10,
  },
  topicCard: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    marginTop: 20,
    position: "relative",
    marginHorizontal: 5,
    backgroundColor: "#A55FEF",
    borderRadius: 20,
  },
  topicImg: {
    width: 120,
    height: 130,
    borderRadius: 20,
    margin: 10,
    position: "relative",
    top: -15,
    left: 5,
    padding: 5,
    backgroundColor: "white",
  },
  topicTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    marginLeft: -10,
  },
  topicSubtitle: {
    color: "#f2f2f2",
    marginTop: -10,
    marginLeft: -10,
  },
  playIcon: {
    position: "absolute",
    right: -20,
    top: 38,
  },
  noTopicsContainer: {
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    paddingVertical: 20,
    borderRadius: 10,
  },
  noTopicsImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  noTopicsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
  },
  button: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#7A6BEF",
    marginVertical: 15,
  },
});

export default TakenTopicsScreen;
