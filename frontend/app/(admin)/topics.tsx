import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  Provider,
  Appbar,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { API_URL } from "../../GetIp";

interface Level {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  levelId: number;
  title: string;
  wordNumber: number;
}

export default function AdminTopicsScreen() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTopic, setNewTopic] = useState({
    Title: "",
    LevelId: "",
    WordNumber: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTopic, setEditTopic] = useState({
    Title: "",
    LevelId: "",
    WordNumber: "",
  });
  const [editVisible, setEditVisible] = useState(false);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/Topic/all-topics`);
      const data = await res.json();
      setTopics(data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch topics");
    }
    setLoading(false);
  };

  const fetchLevels = async () => {
    try {
      const res = await fetch(`${API_URL}/Level`);
      const data = await res.json();
      setLevels(data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch levels");
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchLevels();
  }, []);

  const handleCreate = async () => {
    if (!newTopic.Title || !newTopic.LevelId || !newTopic.WordNumber) {
      Alert.alert("Validation", "All fields are required");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/Topic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTopic.Title,
          levelId: parseInt(newTopic.LevelId),
          wordNumber: parseInt(newTopic.WordNumber),
        }),
      });
      if (res.ok) {
        setNewTopic({ Title: "", LevelId: "", WordNumber: "" });
        fetchTopics();
      } else {
        const err = await res.json();
        Alert.alert("Error", err?.error || "Failed to create topic");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to create topic");
    }
  };

  const startEdit = (topic: Topic) => {
    setEditingId(topic.id);
    setEditTopic({
      Title: topic.title,
      LevelId: topic.levelId.toString(),
      WordNumber: topic.wordNumber.toString(),
    });
    setEditVisible(true);
  };

  const handleEdit = async () => {
    if (!editTopic.Title || !editTopic.LevelId || !editTopic.WordNumber) {
      Alert.alert("Validation", "All fields are required");
      return;
    }
    if (editingId === null) return;

    try {
      const res = await fetch(`${API_URL}/Topic/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTopic.Title,
          levelId: parseInt(editTopic.LevelId),
          wordNumber: parseInt(editTopic.WordNumber),
        }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditTopic({ Title: "", LevelId: "", WordNumber: "" });
        setEditVisible(false);
        fetchTopics();
      } else {
        const err = await res.json();
        Alert.alert("Error", err?.error || "Failed to update topic");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to update topic");
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm", "Delete this topic?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/Topic/${id}`, {
              method: "DELETE",
            });
            if (res.ok) fetchTopics();
            else Alert.alert("Error", "Failed to delete");
          } catch {
            Alert.alert("Error", "Failed to delete topic");
          }
        },
      },
    ]);
  };

  return (
    <Provider>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Topics Management" />
      </Appbar.Header>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <FlatList
            contentContainerStyle={{ padding: 16 }}
            data={topics}
            keyExtractor={(item) => item.id.toString()}
            refreshing={loading}
            onRefresh={fetchTopics}
            ListHeaderComponent={
              <>
                {/* <Text style={styles.title}>Manage Topics</Text> */}
                <Card style={styles.card}>
                  <Text style={styles.sectionTitle}>Create New Topic</Text>
                  <TextInput
                    placeholder="Title"
                    value={newTopic.Title}
                    onChangeText={(t) => setNewTopic({ ...newTopic, Title: t })}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="LevelId"
                    value={newTopic.LevelId}
                    keyboardType="numeric"
                    onChangeText={(t) =>
                      setNewTopic({ ...newTopic, LevelId: t })
                    }
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="WordNumber"
                    value={newTopic.WordNumber}
                    keyboardType="numeric"
                    onChangeText={(t) =>
                      setNewTopic({ ...newTopic, WordNumber: t })
                    }
                    style={styles.input}
                  />
                  <Button
                    mode="contained"
                    onPress={handleCreate}
                    style={{ marginTop: 8 }}
                  >
                    Create
                  </Button>
                </Card>
              </>
            }
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text>LevelId: {item.levelId}</Text>
                <Text>WordNumber: {item.wordNumber}</Text>
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <IconButton icon="pencil" onPress={() => startEdit(item)} />
                  <IconButton
                    icon="delete"
                    onPress={() => handleDelete(item.id)}
                  />
                </View>
              </Card>
            )}
            ListFooterComponent={
              <>
                <Button
                  mode="contained"
                  onPress={() => router.back()}
                  style={{ marginTop: 16, marginBottom: 30 }}
                >
                  Back
                </Button>
                <Portal>
                  <Modal
                    visible={editVisible}
                    onDismiss={() => setEditVisible(false)}
                    contentContainerStyle={styles.modal}
                  >
                    <Text style={styles.sectionTitle}>Edit Topic</Text>
                    <TextInput
                      placeholder="Title"
                      value={editTopic.Title}
                      onChangeText={(t) =>
                        setEditTopic({ ...editTopic, Title: t })
                      }
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="LevelId"
                      value={editTopic.LevelId}
                      keyboardType="numeric"
                      onChangeText={(t) =>
                        setEditTopic({ ...editTopic, LevelId: t })
                      }
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="WordNumber"
                      value={editTopic.WordNumber}
                      keyboardType="numeric"
                      onChangeText={(t) =>
                        setEditTopic({ ...editTopic, WordNumber: t })
                      }
                      style={styles.input}
                    />
                    <Button
                      mode="contained"
                      onPress={handleEdit}
                      style={{ marginTop: 8 }}
                    >
                      Save Changes
                    </Button>
                  </Modal>
                </Portal>
              </>
            }
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Provider>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
    padding: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 16,
    borderRadius: 8,
  },
});
