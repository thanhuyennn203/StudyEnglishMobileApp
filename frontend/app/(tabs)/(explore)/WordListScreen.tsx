import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WordCard from "./WordCard";
import { Ionicons } from "@expo/vector-icons";

export default function WordListScreen() {
  const { topicId } = useLocalSearchParams();
  const router = useRouter();
  const [words, setWords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);

  const fetchWords = useCallback(() => {
    if (!topicId) return;

    setLoading(true);
    setTimeoutReached(false);

    let isMounted = true;

    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        setTimeoutReached(true);
        setLoading(false);
      }
    }, 10000);

    fetch(`http://localhost:5130/api/Words/by-topic/${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setWords(data);
            setTimeoutReached(false);
          } else {
            setWords([]);
            setTimeoutReached(true);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching words:", err);
        setTimeoutReached(true);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [topicId]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const renderItem = ({ item }) => (
    <WordCard
      word={item.spelling}
      definition={item.definition}
      audio={item.audioUrl}
      onPress={() =>
        router.push({
          pathname: "/WordDetailScreen",
          params: {
            word: item.spelling,
            image: item.imageUrl,
            audio: item.audioUrl,
            pronunciation: item.ipa,
          },
        })
      }
    />
  );

  const renderHeader = () => (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {renderHeader()}
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={styles.loadingText}>🪄 Loading your magic words...</Text>
      </View>
    );
  }

  if (timeoutReached || (Array.isArray(words) && words.length === 0)) {
    return (
      <View style={styles.loadingContainer}>
        {renderHeader()}
        <Text style={styles.timeoutText}>
          ⏰ Oops! No words found for this topic. Please try again later.
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
        keyExtractor={(item) => item.id.toString()}
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
    paddingHorizontal: 30,
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
  headerContainer: {
    backgroundColor: "#FFF7EF",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF7EF",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});
