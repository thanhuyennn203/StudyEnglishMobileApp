import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const getTopicIcon = (title) => {
  title = title.toLowerCase();
  if (title.includes("color"))
    return "https://cdn-icons-png.flaticon.com/512/3195/3195696.png";
  if (title.includes("family"))
    return "https://cdn-icons-png.flaticon.com/512/1035/1035688.png";
  return "https://cdn-icons-png.flaticon.com/512/2232/2232688.png";
};

export default function ExploreScreen() {
  const { levelId } = useLocalSearchParams();
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5130/api";

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const url = levelId
          ? `${API_URL}/Topic?levelId=${levelId}`
          : `${API_URL}/Topic`;
        const res = await fetch(url);
        const data = await res.json();
        setTopics(data);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [levelId]);

  const renderItem = ({ item }) => {
    const icon = getTopicIcon(item.title);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/WordListScreen?topicId=${item.id}`)}
      >
        <Image source={{ uri: icon }} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtext}>{item.wordNumber} words</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {levelId ? ` Topics for Level ${levelId}` : " Explore All Topics"}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" />
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF4F9",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFE8E8",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
  },
  icon: {
    width: 44,
    height: 44,
    marginRight: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  subtext: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
});
