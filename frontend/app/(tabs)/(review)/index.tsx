import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { Button, IconButton, ProgressBar } from "react-native-paper";
import { router } from "expo-router";
import CustomText from "@/components/CustomText";
import GameScreen from "./GameScreen";
import TakenTopicsScreen from "./TakenTopicScreen";

export default function MyCoursesScreen() {
  const [activeSection, setActiveSection] = useState("learned");

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Fixed Header */}
        <View style={styles.header}>
          {/* <CustomText style={styles.headerTitle}>My Courses</CustomText> */}

          <View style={styles.adCard}>
            <View style={styles.infoContainer}>
              <CustomText style={styles.adTitle}>Hi Tom</CustomText>
              <CustomText style={styles.adText}>
                Review your words every 2 days and double your retention rate.
              </CustomText>
            </View>
            <Image
              source={require("@/assets/images/avatar.jpg")}
              style={styles.adImg}
            />
          </View>

          <View style={styles.reviewContainer}>
            <CustomText
              style={[
                styles.review,
                activeSection === "learned" && styles.activeReview,
              ]}
              onPress={() => setActiveSection("learned")}
            >
              Learned words
            </CustomText>

            <CustomText
              style={[
                styles.review,
                activeSection === "game" && styles.activeReview,
              ]}
              onPress={() => setActiveSection("game")}
            >
              Game
            </CustomText>

            <CustomText
              style={[
                styles.review,
                activeSection === "test" && styles.activeReview,
              ]}
              onPress={() => setActiveSection("test")}
            >
              Test
            </CustomText>
          </View>
        </View>

        {/* Dynamic Section */}
        <View>
          {activeSection === "learned" && <TakenTopicsScreen />}
          {activeSection === "game" && <GameScreen />}
          {activeSection === "test" && <GameScreen />}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 60,
    backgroundColor: "#F9F9F9",
  },
  header: {},
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4A90E2",
  },
  adCard: {
    flexDirection: "row",
    backgroundColor: "#f7f9fc",
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    alignItems: "center",
  },
  adImg: {
    width: 110,
    height: 130,
    borderRadius: 20,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  adTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
  adText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#5d4037",
  },
  reviewContainer: {
    flexDirection: "row",
    gap: 15,
  },
  review: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f2f5fa",
    fontSize: 16,
  },
  activeReview: {
    backgroundColor: "#4A90E2", // or any highlight color
    color: "white",
  },

  sectionText: {
    fontSize: 18,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    textAlign: "center",
    elevation: 2,
  },
  scroll: {
    paddingBottom: 60,
  },

  streakContainer: {
    position: "absolute",
    top: -20,
    right: 0,
    zIndex: 10,
    borderRadius: 20,
    elevation: 3,
  },
  streakday: {
    position: "absolute",
    left: "86%",
    top: 15,
    zIndex: 15,
    color: "#660568",
    fontSize: 18,
    borderRadius: 100,
    paddingHorizontal: 6,
  },

  label: {
    fontSize: 18,
    fontWeight: "700",
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progress: {
    height: 6,
    borderRadius: 3,
  },
  card: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 12,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
  },
  iconButton: {
    alignSelf: "flex-end",
    marginTop: 0,
  },
});
