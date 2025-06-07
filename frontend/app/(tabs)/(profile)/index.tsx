import * as React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar, Chip, Divider } from 'react-native-paper';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar.Image
          size={80}
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={{ marginBottom: 12 }}
        />
        <Text variant="titleLarge">Albert Jey Newsy</Text>
        <Chip style={{ marginTop: 6 }} mode="outlined">
          Professional Player
        </Chip>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statNumber}>2,781</Text>
          <Text style={styles.statLabel}>Winner</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statNumber}>3,340</Text>
          <Text style={styles.statLabel}>Play Match</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statNumber}>923</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statNumber}>245</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button mode="contained" style={styles.button}>
          Edit Profile
        </Button>
        <Button mode="outlined" style={styles.button}>
          Messages
        </Button>
      </View>

      {/* Divider */}
      <Divider style={{ marginVertical: 18 }} />

      {/* Latest Play */}
      <View>
        <View style={styles.latestHeader}>
          <Text variant="titleMedium">Latest Play</Text>
          <Button compact>View All</Button>
        </View>

        {/* Game Cards */}
        <Card style={styles.card}>
          <Card.Title
            title="Quiz school game"
            left={() => <Image source={{ uri: 'https://placehold.co/40x40' }} style={styles.gameImg} />}
          />
          <Card.Content>
            <Button mode="contained-tonal" compact>
              Continue
            </Button>
            <Text style={{ marginTop: 6, color: '#888' }}>75 / 100</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Farm Frenzy brain"
            left={() => <Image source={{ uri: 'https://placehold.co/40x40?text=FF' }} style={styles.gameImg} />}
          />
          <Card.Content>
            <Button mode="contained-tonal" compact>
              Continue
            </Button>
            <Text style={{ marginTop: 6, color: '#888' }}>42 / 100</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6e8' },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statBlock: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 8,
  },
  button: {
    minWidth: 130,
    marginHorizontal: 4,
  },
  latestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  card: {
    marginVertical: 6,
    borderRadius: 14,
    elevation: 2,
    marginHorizontal: 6,
  },
  gameImg: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
});
