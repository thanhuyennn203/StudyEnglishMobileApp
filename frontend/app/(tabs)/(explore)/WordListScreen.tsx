import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  ProgressBar,
  MD3Colors,
  Appbar,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import WordCard from "./WordCard";
import { API_URL } from "../../../GetIp";
import { useAuth } from "../../../hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";

export default function WordListScreen() {
  const { topicId, topicName } = useLocalSearchParams();
  // console.log(topicName);
  const parsedTopicId =
    typeof topicId === "string"
      ? parseInt(topicId, 10)
      : Array.isArray(topicId)
      ? parseInt(topicId[0], 10)
      : 0;
  const router = useRouter();
  const [words, setWords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  // const userId = 1;
  // console.log("user id", parsedTopicId);
  const fetchWords = useCallback(() => {
    if (!parsedTopicId) return;

    setLoading(true);
    setTimeoutReached(false);
    let isMounted = true;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    // console.log("user", user);
    // If userId is not available, use the public endpoint
    const url = userId
      ? `${API_URL}/Words/by-topic-user?topicId=${parsedTopicId}&userId=${userId}`
      : `${API_URL}/Words/by-topic/${parsedTopicId}`;

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setWords(data);
            // console.log(data);
            setTimeoutReached(false);
          } else {
            setWords([]);
            setTimeoutReached(true);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.warn("Fetch aborted due to timeout");
        } else {
          console.error("Error fetching words:", err);
        }
        if (isMounted) {
          setTimeoutReached(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [parsedTopicId, userId]);

  useFocusEffect(
    useCallback(() => {
      fetchWords();
    }, [fetchWords])
  );
  // console.log("words: ", words);

  const renderItem = ({ item }) => {
    const word = userId ? item.word : item;
    // console.log(item);
    let learned = false;
    if (userId && item.latestLearning?.status) {
      learned = true;
    }

    // console.log("pass learned: ");
    return (
      <WordCard
        word={word.spelling}
        definition={word.definition}
        learned={learned}
        onPress={() =>
          router.push({
            pathname: "/WordDetailScreen",
            params: {
              word: word.spelling,
              status: learned,
              wordId: word.id,
              topicId: word.topicId,
            },
          })
        }
      />
    );
  };

  const renderHeader = () => (
    <Appbar.Header mode="center-aligned">
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content title={topicName} />
    </Appbar.Header>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {renderHeader()}
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={styles.loadingText}>Loading your magic words...</Text>
      </View>
    );
  }

  if (timeoutReached || (Array.isArray(words) && words.length === 0)) {
    return (
      <View style={styles.loadingContainer}>
        {/* {renderHeader()} */}
        <Text style={styles.timeoutText}>
          Oops! No words found for this topic. Please try again later.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWords}>
          <Text style={styles.retryText}>🔄 Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      {renderHeader()}
      <FlatList
        data={words}
        keyExtractor={(item) =>
          (item.word?.id || item.Word?.id)?.toString() ??
          Math.random().toString()
        }
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#FFF7EF",
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7EF",
    // paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#FF6F61",
    fontWeight: "bold",
  },
  timeoutText: {
    fontSize: 16,
    color: "#D33",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FF6F61",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
