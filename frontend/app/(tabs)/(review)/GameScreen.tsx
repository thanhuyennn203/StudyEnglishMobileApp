import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Avatar,
  Button,
  Text,
  Searchbar,
  Modal,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";
import { useAuth } from "../../../hooks/useAuth";

export default function GameScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  // console.log(userId);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 40,
    margin: 20,
    borderRadius: 10,
  };

  const images = [
    require("../../../assets/images/game_1.jpg"),
    require("../../../assets/images/game_2.jpg"),
    require("../../../assets/images/game_3.jpg"),
    require("../../../assets/images/game_4.jpg"),
    require("../../../assets/images/game_5.jpg"),
    require("../../../assets/images/game_6.jpg"),
  ];

  const today = new Date();
  const options = { month: "short", day: "numeric", weekday: "short" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("@/assets/images/notavailable.jpg")}
              style={{ width: 120, height: 120, marginBottom: 15 }}
            />
            <CustomText style={{ fontSize: 20, textAlign: "center" }}>
              Game is not available now. Login and complete all test to play!
            </CustomText>
          </View>
        </Modal>
      </Portal>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <CustomText style={styles.header}>Explore Game</CustomText>
        <Searchbar
          value=""
          placeholder="Search game..."
          style={styles.searchBar}
        />
        <CustomText style={styles.date}>{formattedDate}</CustomText>
        <CustomText style={styles.today}>Today</CustomText>
        <Image
          source={require("../../../assets/images/game_banner_1.jpg")}
          style={styles.banner}
        />

        <View style={{ position: "relative" }}>
          <Text variant="headlineMedium" style={styles.title}>
            Clash Royale Halo
          </Text>
          <View style={styles.ratingRow}>
            <CustomText style={styles.rating}>4.0</CustomText>
            <CustomText>⭐⭐⭐⭐☆</CustomText>
          </View>
          <Button mode="contained" onPress={showModal} style={styles.getButton}>
            GET
          </Button>
        </View>

        <CustomText style={styles.subTitle}>You May Also Like</CustomText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((imgSrc, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (index === 0) {
                  if (userId) {
                    router.push("/VocabFlashGame");
                  } else {
                    showModal();
                  }
                } else {
                  showModal();
                }
              }}
            >
              <Avatar.Image size={100} source={imgSrc} style={styles.avatar} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { padding: 5 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
  },
  searchBar: {
    marginBottom: 5,
    borderRadius: 25,
    backgroundColor: "#F9F9F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  date: { color: "#737171" },
  today: { fontWeight: "bold", fontSize: 24, marginTop: -10 },
  banner: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    paddingLeft: 5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -15,
    paddingLeft: 5,
  },
  rating: { marginRight: 5 },
  getButton: {
    marginVertical: 10,
    position: "absolute",
    top: 5,
    right: 30,
    backgroundColor: "#7A6BEF",
  },
  subTitle: { marginTop: 20 },
  avatar: { margin: 8 },
});
