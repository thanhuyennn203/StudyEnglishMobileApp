import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router'; // ✅ Import router

const levels = [
  {
    id: 1,
    name: 'Beginner',
    icon: 'https://cdn-icons-png.flaticon.com/128/6789/6789466.png',
    lessons: 10,
    status: 'completed',
    color: '#A8DADC',
  },
  {
    id: 2,
    name: 'Elementary',
    icon: 'https://cdn-icons-png.flaticon.com/128/15599/15599432.png',
    lessons: 12,
    status: 'completed',
    color: '#CDB4DB',
  },
  {
    id: 3,
    name: 'Intermediate',
    icon: 'https://cdn-icons-png.flaticon.com/128/8653/8653081.png',
    lessons: 14,
    status: 'current',
    color: '#FFB4A2',
  },
  {
    id: 4,
    name: 'Upper-Intermediate',
    icon: 'https://cdn-icons-png.flaticon.com/128/1998/1998713.png',
    lessons: 16,
    status: 'locked',
    color: '#BDE0FE',
  },
  {
    id: 5,
    name: 'Advanced',
    icon: 'https://cdn-icons-png.flaticon.com/128/1016/1016742.png',
    lessons: 18,
    status: 'locked',
    color: '#FFC8DD',
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter(); // ✅ Hook router

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>Samuel</Text>
          <Text style={styles.role}>Student</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Explore your Levels 🚀</Text>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="Search your levels"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#888"
      />

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Learn new things!</Text>
        <Text style={styles.bannerSub}>The best way to learn English fast.</Text>
        <TouchableOpacity
  style={styles.playBtn}
  onPress={() => router.push('/(tabs)/(explore)')} // ✅ Đúng path
>
  <Text style={styles.playText}>▶ Play</Text>
</TouchableOpacity>

      </View>

      {/* Your Levels */}
      <Text style={styles.subtitle}>Your Levels</Text>
      <View style={{ gap: 12 }}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.levelRow,
              {
                backgroundColor: level.color,
                opacity: level.status === 'locked' ? 0.7 : 1,
              },
            ]}
            disabled={level.status === 'locked'}
          >
            {level.status === 'locked' && (
              <Text style={styles.lockIcon}>🔒</Text>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: level.icon }}
                style={styles.levelImage}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.levelName}>{level.name}</Text>
                <Text style={styles.levelLesson}>{level.lessons} Lessons</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.levelPlay} disabled={level.status === 'locked'}>
              <Text style={styles.levelPlayText}>▶</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  username: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  role: { color: '#666', fontSize: 14 },
  title: { fontSize: 24, color: '#000', fontWeight: 'bold', marginBottom: 12 },
  search: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#000',
    marginBottom: 20,
  },
  banner: {
    backgroundColor: '#FD8916',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  bannerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bannerSub: { color: '#fff', fontSize: 14, marginVertical: 8 },
  playBtn: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  playText: { color: '#FD8916', fontWeight: 'bold' },
  subtitle: { fontSize: 18, color: '#000', marginBottom: 12 },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    position: 'relative',
  },
  levelImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  },
  levelName: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  levelLesson: { color: '#000', marginTop: 4 },
  levelPlay: {
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelPlayText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  lockIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    fontSize: 16,
    transform: [{ rotate: '20deg' }],
    color: '#444',
  },
});
