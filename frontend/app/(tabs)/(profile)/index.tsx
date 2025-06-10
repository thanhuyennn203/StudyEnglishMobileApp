import * as React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar, Chip, Divider } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';

import { useRouter } from "expo-router";
import { useAuth } from '../../../hooks/useAuth'; // Adjust the path if needed

export default function ProfileScreen() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    React.useEffect(() => {
        if (!loading && !user) {
            router.replace('/(auth)/login');
        }
    }, [user, loading]);

    if (loading || !user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    // Prepare data for BarChart
    const barData = [
        { value: 5, label: '6/1' },
        { value: 2, label: '6/2' },
        { value: 1, label: '6/3' },
        { value: 4, label: '6/4' },
        { value: 3, label: '6/5' },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        
            <View style={styles.header}>
                <Avatar.Image
                    size={80}
                    source={{ uri: user.avatarUrl || 'https://randomuser.me/api/portraits/men/32.jpg' }}
                    style={{ marginBottom: 12 }}
                />
                <Text variant="titleLarge">{user.displayName || user.email}</Text>
                <Chip style={{ marginTop: 6 }} mode="outlined">
                    {user.CurrentLevel ? `Level ${user.CurrentLevel}` : 'Beginner'}
                </Chip>
            </View>

            <Text>{user.Role}</Text>

            
            <View style={styles.buttonRow}>
                <Button mode="contained" style={styles.button} onPress={() => router.push("/(tabs)/(profile)/edit")}>
                    Edit Profile
                </Button>
                <Button mode="outlined" style={styles.button}>
                    Messages
                </Button>
            </View>

          
            <Divider style={{ marginVertical: 18 }} />

           
            <View style={{ height: 320, padding: 16 }}>
                <Text style={{ marginBottom: 12, fontWeight: 'bold', fontSize: 16 }}>Recent Activity</Text>
                <BarChart
                    data={barData}
                    barWidth={28}
                    spacing={18}
                    roundedTop
                    hideRules
                    yAxisThickness={0}
                    xAxisThickness={0}
                    frontColor={'#44a340'}
                    noOfSections={4}
                    maxValue={6}
                />
            </View>
           
            <View style={styles.logoutContainer}>
                <Button
                    mode="contained-tonal"
                    onPress={async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    }}
                    style={styles.logoutButton}
                    contentStyle={{ height: 48 }}
                >
                    Log Out
                </Button>
            </View>
        </ScrollView>


    );
}

const styles = StyleSheet.create(
    {
    container: {
        paddingTop: 50,
        flex: 1,
        backgroundColor: '#f5f6e8'
    },
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
    logoutContainer: {
        padding: 24,
        paddingBottom: 32,
        backgroundColor: '#f5f6e8',
    },
    logoutButton: {
        borderRadius: 16,
    },
});
