import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ModalNotification({
  visible,
  onClose,
  message,
  imageSource,
}) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close icon */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#555" />
          </TouchableOpacity>

          {/* Image */}
          {imageSource && (
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* OK Button */}
          <Button mode="contained" onPress={onClose} style={styles.button}>
            OK
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    width: "60%",
    backgroundColor: "#4CAF50",
  },
});
