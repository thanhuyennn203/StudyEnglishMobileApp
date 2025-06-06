import CustomText from "@/components/CustomText";
import React, { useState, useEffect } from "react";
import { ScrollView, Image, View, StyleSheet } from "react-native";
import { Card, Button, List } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TakenTopicsScreen = () => {
  const router = useRouter();

  const [topics, setTopics] = useState([]);
  const userId = 2;

  useEffect(() => {
    const url = "http://localhost:5130/api/Topic/CompletedByUser/" + userId;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => {
        setTopics(data);
        console.log(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []); // FIX: remove `word` from dependency array
  return (
    <ScrollView style={styles.container}>
      {/* Header Course Card */}
      <MaterialCommunityIcons
        name="arrow-left-bold-circle"
        style={styles.backBtn}
        onPress={() => router.back()}
        size={48}
        color="#FFD700"
      />
      <CustomText style={styles.level}>My Progress</CustomText>

      <View>
        <Card style={{ marginBottom: 20, backgroundColor: "#d2f5e3" }}>
          <Card.Content>
            <CustomText>Children Music Course</CustomText>
            <CustomText>Level 1 – Level 5</CustomText>
            <Button
              mode="contained"
              style={{ marginTop: 10 }}
              onPress={() => {}}
            >
              Join
            </Button>
          </Card.Content>
          {/* <Card.Cover source={{ uri: "https://i.imgur.com/H5pAoR7.png" }} /> */}
        </Card>
        {/* Taken Lessons List */}
        {topics.map((topic, index) => (
          <Card
            key={index}
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {
              router.push({
                pathname: "/FlashCardScreen",
                params: {
                  topicId: topic.id,
                  topicName: topic.title,
                },
              });
            }}
          >
            <Image
              source={{ uri: topic.image }}
              style={{ width: 80, height: 80, borderRadius: 8, margin: 10 }}
            />
            <Card.Content style={{ flex: 1 }}>
              <CustomText>{topic.title}</CustomText>
            </Card.Content>
            <Button icon="play-circle" onPress={() => {}} />
          </Card>
        ))}{" "}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#fff5f8",
    paddingTop: 60,
  },
  backBtn: {
    position: "absolute",
    top: -5,
    left: 10,
    zIndex: 10,
    borderRadius: 50,
  },
  level: {
    fontSize: 30,
    textAlign: "center",
    color: "#FF6F00",
  },
});

export default TakenTopicsScreen;
