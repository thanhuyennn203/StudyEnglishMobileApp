import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Animated,
  Pressable,
  View,
  Text as RNText,
} from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

const FlashCardScreen = () => {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start();
    setFlipped(!flipped);
  };

  return (
    <Pressable onPress={flipCard}>
      <View style={styles.cardContainer}>
        {/* Front Side */}
        <Animated.View
          style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}
        >
          <Card>
            <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
            <Card.Title title="Topic Name here" />
          </Card>
        </Animated.View>

        {/* Back Side */}
        <Animated.View
          style={[
            styles.card,
            styles.backCard,
            { transform: [{ rotateY: backInterpolate }] },
          ]}
        >
          <Card>
            <Card.Content>
              <Text variant="titleLarge">Spelling: C-A-T</Text>
              <Text variant="bodyMedium">This is a sample spelling card.</Text>
            </Card.Content>
            <Card.Actions>
              <Button>Cancel</Button>
              <Button>Ok</Button>
            </Card.Actions>
          </Card>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 350,
    height: 550,
    alignSelf: "center",
    marginTop: 100,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },
  backCard: {
    zIndex: 1,
  },
});

export default FlashCardScreen;
