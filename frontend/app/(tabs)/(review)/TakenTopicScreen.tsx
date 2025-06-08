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

const cardColors = ["#A55FEF", "#3AAFFF", "#FD8916", "#45C4B0", "#FCCA38"];

const TakenTopicsScreen = () => {
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  const userId = 1;

  // Fetch topics
  useEffect(() => {
    const url = "http://192.168.1.17:5130/api/Topic/CompletedByUser/" + userId;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => setTopics(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [topics]);

  // Assign fixed random color to each topic
  const coloredTopics = useMemo(() => {
    return topics.map((topic, index) => ({
      ...topic,
      color: cardColors[index % cardColors.length], // loop colors
    }));
  }, [topics]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <CustomText style={styles.header}>My Progress</CustomText>

      {coloredTopics.map((topic, index) => {
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
                <CustomText
                  style={{
                    color: "#ffff",
                    fontWeight: "bold",
                    fontSize: 24,
                    marginLeft: -10,
                  }}
                >
                  {topic.title}
                </CustomText>
                <CustomText
                  style={{
                    color: "#f2f2f2",
                    marginTop: -10,
                    marginLeft: -10,
                  }}
                >
                  {topic.wordNumber} words
                </CustomText>
              </Card.Content>
              <Button
                icon="play-circle"
                onPress={() => {}}
                textColor="#FFFFFF"
                labelStyle={{ fontSize: 45 }} // bigger icon
                children={undefined}
                style={styles.playIcon}
              />
            </Animated.View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  header: {
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  playIcon: {
    position: "absolute",
    right: -20,
    top: 38,
  },
});

export default TakenTopicsScreen;
