import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  Avatar,
  Chip,
  Divider,
  Appbar,
} from "react-native-paper";
import { BarChart } from "react-native-gifted-charts";
import CustomText from "@/components/CustomText";
import { useRouter } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const avatarUrl = user?.avatarUrl || "@/assets/images/avatar.jpg";

  // console.log(avatarUrl);
  const barData = [
    { value: 5, label: "6/1" },
    { value: 2, label: "6/2" },
    { value: 1, label: "6/3" },
    { value: 4, label: "6/4" },
    { value: 3, label: "6/5" },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="My Profile" />
      </Appbar.Header>

      {loading ? (
        <View style={styles.centered}>
          <CustomText>Loading...</CustomText>
        </View>
      ) : !user ? (
        <View style={styles.centered}>
          <CustomText style={{ fontSize: 16, marginBottom: 16 }}>
            You are not logged in
          </CustomText>
          <Button
            mode="contained"
            onPress={() => router.replace("/(auth)/login")}
          >
            Login Now
          </Button>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Avatar.Image size={90} source={{ uri: avatarUrl }} />
            <CustomText style={styles.name}>
              {user.displayName || user.email}
            </CustomText>
            <Chip style={styles.levelChip}>
              {user.CurrentLevel ? `Level ${user.CurrentLevel}` : "Beginner"}
            </Chip>
            <CustomText style={styles.role}>{user.Role}</CustomText>
          </View>

          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => router.push("/(tabs)/(profile)/edit")}
            >
              Edit Profile
            </Button>
            <Button mode="outlined" style={styles.button}>
              Messages
            </Button>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Learning Progress</Text>
            <BarChart
              data={barData}
              barWidth={28}
              spacing={18}
              roundedTop
              hideRules
              yAxisThickness={0}
              xAxisThickness={0}
              frontColor={"#0077CC"}
              noOfSections={4}
              maxValue={6}
            />
          </View>

          <View style={styles.logoutContainer}>
            <Button
              mode="contained-tonal"
              onPress={async () => {
                await logout();
                router.replace("/(auth)/login");
              }}
              style={styles.logoutButton}
              contentStyle={{ height: 48 }}
            >
              Log Out
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    alignItems: "center",
    padding: 24,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },
  role: {
    textAlign: "center",
    fontSize: 14,
    color: "#777",
    marginTop: 6,
  },
  levelChip: {
    marginTop: 8,
    backgroundColor: "#E6F0FF",
    borderColor: "#0077CC",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 16,
    marginHorizontal: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  divider: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  chartContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#0077CC",
    textAlign: "center",
  },
  logoutContainer: {
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  logoutButton: {
    borderRadius: 16,
  },
});
