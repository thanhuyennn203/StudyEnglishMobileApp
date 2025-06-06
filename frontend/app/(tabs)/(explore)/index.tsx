import CustomText from "@/components/CustomText";
import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  ProgressBar,
  Card,
  IconButton,
  Searchbar,
  Button,
} from "react-native-paper";

const CourseCard = ({ title, completed, total, color, icon, onPress }) => {
  const progress = completed / total;

  return (
    <Card style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
      <Card.Content>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardProgress}>
          Completed {completed}/{total}
        </Text>
        <ProgressBar
          progress={progress}
          color="white"
          style={styles.progress}
        />
      </Card.Content>
      <IconButton
        icon={icon}
        size={30}
        style={styles.iconButton}
        iconColor="white"
      />
    </Card>
  );
};

export default function MyCoursesScreen() {
  return (
    <ScrollView style={styles.container}>
      <CustomText style={styles.header}>My Courses</CustomText>
      <View style={styles.streakContainer}>
        <IconButton
          icon="fire"
          iconColor="#FF5722"
          size={40}
          onPress={() => {
            // Optionally show streak details
          }}
        />
      </View>

      {/* Search bar */}
      {/* <Searchbar placeholder="Search course..." style={styles.searchBar} /> */}

      {/* Learning Progress */}
      <Card style={styles.learningCard}>
        <Card.Content>
          <Text style={styles.label}>Learned today</Text>
          <Text style={styles.time}>46min / 60min</Text>
          <ProgressBar
            progress={46 / 60}
            color="#f57c00"
            style={styles.progress}
          />
        </Card.Content>
      </Card>
      <Card style={styles.adCard}>
        <Card.Content>
          <Text style={styles.adTitle}>Boost Your Vocabulary!</Text>
          <Text style={styles.adText}>
            Review your words every 2 days and double your retention rate.
          </Text>
          <Button
            mode="contained-tonal"
            style={styles.adButton}
            onPress={() => {
              // navigate or show modal
            }}
          >
            Learn More
          </Button>
        </Card.Content>
      </Card>

      {/* Learned Cards */}
      <View style={styles.grid}>
        <CourseCard
          title="Learned Words"
          completed={10}
          total={20}
          color="#f8d7da"
          icon="book-outline"
          onPress={() => router.push("/TakenTopicScreen")}
        />
        <CourseCard
          title="Game"
          completed={15}
          total={30}
          color="#d0e7ff"
          icon="controller-classic-outline"
        />
        <CourseCard
          title="Test"
          completed={8}
          total={10}
          color="#c0e4dc"
          icon="check-circle-outline"
        />
      </View>

      {/* Daily Quiz Button */}
      <Button
        mode="contained"
        icon="lightbulb-on-outline"
        onPress={() => {}}
        style={styles.quizButton}
      >
        Take Daily Quiz
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FF6F00",
  },
  searchBar: {
    marginBottom: 20,
    borderRadius: 12,
  },
  overallCard: {
    marginBottom: 16,
    padding: 10,
    elevation: 2,
  },
  learningCard: {
    marginBottom: 16,
    padding: 10,
    elevation: 2,
  },

  adCard: {
    backgroundColor: "#fff3e0",
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e65100",
    marginBottom: 6,
  },
  adText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#5d4037",
  },
  adButton: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 12,
  },

  label: {
    fontSize: 14,
    color: "#777",
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 12,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  cardProgress: {
    fontSize: 14,
    marginBottom: 4,
    color: "#555",
  },
  iconButton: {
    alignSelf: "flex-end",
    marginTop: -10,
  },
  quizButton: {
    marginVertical: 24,
    borderRadius: 24,
  },
  streakContainer: {
    position: "absolute",
    top: -21,
    right: 0,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 3,
  },
});
