import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Video } from "expo-av";
import { useAuth } from "../../../hooks/useAuth";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();

  const API_URL = "http://localhost:5130/api/Level"; // đổi IP nếu dùng thiết bị thật

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const mappedLevels = data.map((item) => {
          let extras = {};
          switch (item.description) {
            case "Beginner":
              extras = {
                icon: "https://cdn-icons-png.flaticon.com/128/6789/6789466.png",
                status: "unlocked",
                color: "#FFEBB7",
                lessons: 10,
              };
              break;
            case "Elementary":
              extras = {
                icon: "https://cdn-icons-png.flaticon.com/128/15599/15599432.png",
                status: "unlocked",
                color: "#B5EAD7",
                lessons: 12,
              };
              break;
            case "Intermediate":
              extras = {
                icon: "https://cdn-icons-png.flaticon.com/128/8653/8653081.png",
                status: "unlocked",
                color: "#FFDAC1",
                lessons: 14,
              };
              break;
            default:
              extras = {
                icon: "https://cdn-icons-png.flaticon.com/128/1998/1998713.png",
                status: "locked",
                color: "#C7CEEA",
                lessons: 16,
              };
              break;
          }

          return {
            ...item,
            ...extras,
          };
        });

        setLevels(mappedLevels);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: user?.avatarUrl || "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>Hi {user?.displayName}!</Text>
            <Text style={styles.role}>Let's learn English 🎉</Text>
          </View>
        </View>

        <Text style={styles.title}>Choose your Level 🎈</Text>

        <TextInput
          style={styles.search}
          placeholder="Search levels..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#aaa"
        />

        <View style={styles.banner}>
          <Text style={styles.bannerText}>🎨 Fun & Colorful Learning!</Text>
          <Text style={styles.bannerSub}>Explore English the playful way!</Text>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => setShowVideo(true)}
          >
            <Text style={styles.playText}>▶ Start Playing</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Available Levels 🌟</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF6F61" />
        ) : (
          <View style={styles.levelGrid}>
            {levels
              .filter((l) =>
                l.description.toLowerCase().includes(search.toLowerCase())
              )
              .map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.levelCard,
                    {
                      backgroundColor: level.color,
                      opacity: level.status === "locked" ? 0.5 : 1,
                    },
                  ]}
                  disabled={level.status === "locked"}
                  onPress={() => {
                    router.push({
                      pathname: "/TopicListScreen",
                      params: { levelId: level.id.toString() },
                    });
                  }}
                >
                  {level.status === "locked" && (
                    <Text style={styles.lockIcon}>🔒</Text>
                  )}
                  <Image
                    source={{ uri: level.icon }}
                    style={styles.levelIcon}
                  />
                  <Text style={styles.levelName}>{level.description}</Text>
                  <Text style={styles.levelLesson}>
                    {level.lessons} lessons
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={showVideo} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Video
              ref={videoRef}
              source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay
              useNativeControls
              style={{ width: "100%", height: 200 }}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowVideo(false)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                ✖ Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    paddingVertical: 50,
    paddingHorizontal: 16,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  username: { color: "#222", fontSize: 20, fontWeight: "bold" },
  role: { color: "#666", fontSize: 14 },
  title: { fontSize: 24, color: "#222", fontWeight: "bold", marginBottom: 12 },
  search: {
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#000",
    marginBottom: 20,
  },
  banner: {
    backgroundColor: "#FFB5E8",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  bannerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  bannerSub: { color: "#fff", fontSize: 14, marginVertical: 8 },
  playBtn: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  playText: { color: "#FF6F61", fontWeight: "bold" },
  subtitle: { fontSize: 18, color: "#333", marginBottom: 12 },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  levelCard: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    position: "relative",
  },
  levelIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  levelName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  levelLesson: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
    textAlign: "center",
  },
  lockIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    fontSize: 20,
    color: "#444",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#FF6F61",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
