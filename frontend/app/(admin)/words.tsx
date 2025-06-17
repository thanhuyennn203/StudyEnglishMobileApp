import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  IconButton,
  Appbar,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { API_URL } from "../../GetIp";

interface Topic {
  id: number;
  title: string;
}

interface Word {
  id: number;
  topicId: number | null;
  spelling: string;
  definition: string;
  imageURL?: string;
  ipa?: string;
  topic?: Topic;
}

export default function AdminWordsScreen() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [topicModalVisible, setTopicModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formWord, setFormWord] = useState({
    Spelling: "",
    Definition: "",
    ImageURL: "",
    Ipa: "",
  });

  // Fetch topics
  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch(`${API_URL}/Topic/all-topics`);
        const data = await res.json();
        setTopics(data);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch topics");
      }
    }
    fetchTopics();
  }, []);

  // Fetch words for selected topic
  useEffect(() => {
    async function fetchWords() {
      if (selectedTopicId === null) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/Words/by-topic/${selectedTopicId}`);
        const data = await res.json();
        setWords(data);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch words");
      }
      setLoading(false);
    }
    fetchWords();
  }, [selectedTopicId]);

  // Helper to fetch words for topic
  const fetchWordsForTopic = async (topicId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/Words/by-topic/${topicId}`);
      const data = await res.json();
      setWords(data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch words");
    }
    setLoading(false);
  };

  // Open modal for create/edit
  const openModal = (word?: Word) => {
    if (word) {
      setIsEditing(true);
      setEditingId(word.id);
      setFormWord({
        Spelling: word.spelling,
        Definition: word.definition,
        ImageURL: word.imageURL || "",
        Ipa: word.ipa || "",
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormWord({ Spelling: "", Definition: "", ImageURL: "", Ipa: "" });
    }
    setModalVisible(true);
  };

  // Create or edit word
  const handleSubmit = async () => {
    if (!formWord.Spelling || !formWord.Definition) {
      Alert.alert("Validation", "Spelling and Definition are required");
      return;
    }
    if (selectedTopicId === null) {
      Alert.alert("Validation", "Please select a topic first");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (isEditing && editingId !== null) {
        res = await fetch(`${API_URL}/Words/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spelling: formWord.Spelling,
            definition: formWord.Definition,
            topicId: selectedTopicId,
            imageURL: formWord.ImageURL || null,
            ipa: formWord.Ipa || null,
          }),
        });
      } else {
        res = await fetch(`${API_URL}/Words`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spelling: formWord.Spelling,
            definition: formWord.Definition,
            topicId: selectedTopicId,
            imageURL: formWord.ImageURL || null,
            ipa: formWord.Ipa || null,
          }),
        });
      }
      if (res.ok) {
        setModalVisible(false);
        setFormWord({ Spelling: "", Definition: "", ImageURL: "", Ipa: "" });
        fetchWordsForTopic(selectedTopicId);
      } else {
        let msg = isEditing ? "Failed to update word" : "Failed to create word";
        try {
          const err = await res.json();
          if (err && err.error) msg = err.error;
        } catch {}
        Alert.alert("Error", msg);
      }
    } catch (err) {
      Alert.alert(
        "Error",
        isEditing ? "Failed to update word" : "Failed to create word"
      );
    }
    setLoading(false);
  };

  // Delete word
  const handleDelete = async (id: number) => {
    if (selectedTopicId === null) return;
    Alert.alert("Confirm", "Delete this word?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const res = await fetch(`${API_URL}/Words/${id}`, {
              method: "DELETE",
            });
            if (res.ok) fetchWordsForTopic(selectedTopicId);
            else Alert.alert("Error", "res not ok");
          } catch (err) {
            Alert.alert("Error", "Failed to delete word");
          }
          setLoading(false);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Words Management" />
      </Appbar.Header>
      {/* <Text style={styles.header}>Manage Words</Text> */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <TouchableOpacity
          style={styles.topicSelector}
          onPress={() => setTopicModalVisible(true)}
        >
          <Text style={styles.topicSelectorText}>
            {selectedTopicId
              ? topics.find((t) => t.id === selectedTopicId)?.title ||
                "Select a Topic"
              : "Select a Topic"}
          </Text>
        </TouchableOpacity>
        {selectedTopicId !== null && (
          <Button
            mode="contained"
            icon="plus"
            onPress={() => openModal()}
            style={{ marginLeft: 12 }}
            labelStyle={{ fontSize: 18 }}
          >
            Add Word
          </Button>
        )}
      </View>
      <Modal
        visible={topicModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTopicModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.topicModalContent}>
            <Text style={styles.modalHeader}>Select a Topic</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {topics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.topicOption,
                    selectedTopicId === topic.id && styles.topicOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedTopicId(topic.id);
                    setTopicModalVisible(false);
                  }}
                >
                  <Text
                    style={
                      selectedTopicId === topic.id
                        ? styles.topicOptionTextSelected
                        : styles.topicOptionText
                    }
                  >
                    {topic.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              mode="outlined"
              onPress={() => setTopicModalVisible(false)}
              style={{ marginTop: 12 }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#4A90E2"
          style={{ marginVertical: 16 }}
        />
      )}
      {selectedTopicId === null ? (
        <Text style={{ color: "#888", marginTop: 32 }}>
          Please select a topic to manage its words.
        </Text>
      ) : (
        <FlatList
          data={words}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Card style={styles.wordCard}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.wordTitle}>{item.spelling}</Text>
                  <Text style={styles.wordDef}>
                    Definition: {item.definition}
                  </Text>
                  {item.ipa ? (
                    <Text style={styles.wordIpa}>IPA: {item.ipa}</Text>
                  ) : null}
                  {item.imageURL ? (
                    <Text style={styles.wordImg}>Image: {item.imageURL}</Text>
                  ) : null}
                </View>
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="pencil" onPress={() => openModal(item)} />
                  <IconButton
                    icon="delete"
                    onPress={() => handleDelete(item.id)}
                  />
                </View>
              </View>
            </Card>
          )}
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {isEditing ? "Edit Word" : "Add Word"}
            </Text>
            <TextInput
              placeholder="Spelling"
              value={formWord.Spelling}
              onChangeText={(t) => setFormWord({ ...formWord, Spelling: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Definition"
              value={formWord.Definition}
              onChangeText={(t) => setFormWord({ ...formWord, Definition: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="IPA (optional)"
              value={formWord.Ipa}
              onChangeText={(t) => setFormWord({ ...formWord, Ipa: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Image URL (optional)"
              value={formWord.ImageURL}
              onChangeText={(t) => setFormWord({ ...formWord, ImageURL: t })}
              style={styles.input}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={{ flex: 1, marginRight: 8 }}
              >
                {isEditing ? "Save" : "Create"}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Button
        mode="contained"
        onPress={() => router.back()}
        style={{ marginTop: 16, marginBottom: 30 }}
      >
        Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  topicSelector: {
    backgroundColor: "#f5f6fa",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  topicSelectorText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  topicModalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  topicOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  topicOptionSelected: {
    backgroundColor: "#e1f5fe",
  },
  topicOptionText: {
    fontSize: 16,
    color: "#333",
  },
  topicOptionTextSelected: {
    fontWeight: "bold",
    color: "#0277bd",
  },
  wordCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f9f9fb",
    elevation: 2,
  },
  wordTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  wordDef: {
    fontSize: 15,
    marginBottom: 2,
  },
  wordIpa: {
    fontSize: 13,
    color: "#888",
  },
  wordImg: {
    fontSize: 13,
    color: "#888",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
});
