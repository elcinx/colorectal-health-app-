import { useRouter } from 'expo-router';
import {
    Activity,
    AlertCircle,
    BookOpen,
    Calendar,
    Info,
    Lightbulb,
    LogOut,
    MessageSquare,
    TestTube2,
    User,
    Users
} from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Card } from '../../components/ui/Card';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - theme.spacing.xl * 2 - theme.spacing.md) / 2;

export default function PatientDashboard() {
    const { user } = useAuthStore();
    const { logout } = useAuth();
    const router = useRouter();

    const menuItems = [
        { id: 'symptoms', title: 'Belirti Yönetimi', icon: Activity, color: '#FF7043', path: '/symptoms' },
        { id: 'questions', title: 'Uzmana Sor', icon: MessageSquare, color: '#42A5F5', path: '/questions' },
        { id: 'experience', title: 'Hasta Deneyimi', icon: Users, color: '#66BB6A', path: '/experience' },
        { id: 'calendar', title: 'Belirti Takvimi', icon: Calendar, color: '#AB47BC', path: '/calendar' },
        { id: 'blood-tests', title: 'Kan Tahlili', icon: TestTube2, color: '#EF5350', path: '/blood-tests' },
        { id: 'recommendations', title: 'Öneriler', icon: Lightbulb, color: '#FFCA28', path: '/recommendations' },
        { id: 'profile', title: 'İletişim', icon: User, color: '#26A69A', path: '/profile' },
        { id: 'about', title: 'Hakkında', icon: Info, color: '#78909C', path: '/about' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Box padding="lg" gap="lg">
                    {/* Header */}
                    <Box direction="row" justify="space-between" align="center">
                        <Box>
                            <Text variant="xl" weight="700" color="primary">Kolorektal Kanser</Text>
                            <Text variant="md" color="textSecondary">Hoş geldin, {user?.full_name}</Text>
                        </Box>
                    </Box>

                    {/* Announcements */}
                    <Box gap="md">
                        <TouchableOpacity onPress={() => router.push('/info/covid')}>
                            <Card style={[styles.announcement, { borderColor: '#E57373' }]} padding="md">
                                <Box direction="row" align="center" gap="md">
                                    <AlertCircle color="#E57373" size={24} />
                                    <Text weight="600">Covid-19 Bilgilendirme</Text>
                                </Box>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/info/general')}>
                            <Card style={[styles.announcement, { borderColor: theme.colors.primary }]} padding="md">
                                <Box direction="row" align="center" gap="md">
                                    <BookOpen color={theme.colors.primary} size={24} />
                                    <Text weight="600">Kanser Hakkında Bilgilendirme</Text>
                                </Box>
                            </Card>
                        </TouchableOpacity>
                    </Box>

                    {/* Grid Navigation */}
                    <View style={styles.grid}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => item.path && router.push(item.path as any)}
                                style={styles.gridItem}
                            >
                                <Card style={styles.menuCard} padding="md">
                                    <Box align="center" gap="sm">
                                        <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
                                            <item.icon size={28} color={item.color} />
                                        </View>
                                        <Text variant="sm" weight="600" style={{ textAlign: 'center' }}>{item.title}</Text>
                                    </Box>
                                </Card>
                            </TouchableOpacity>
                        ))}

                        {/* Logout Item */}
                        <TouchableOpacity onPress={logout} style={styles.gridItem}>
                            <Card style={styles.menuCard} padding="md">
                                <Box align="center" gap="sm">
                                    <View style={[styles.iconCircle, { backgroundColor: theme.colors.error + '20' }]}>
                                        <LogOut size={28} color={theme.colors.error} />
                                    </View>
                                    <Text variant="sm" weight="600" color="error">Çıkış Yap</Text>
                                </Box>
                            </Card>
                        </TouchableOpacity>
                    </View>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scroll: {
        paddingBottom: theme.spacing.xl,
    },
    announcement: {
        borderLeftWidth: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    gridItem: {
        width: GRID_SIZE,
    },
    menuCard: {
        height: GRID_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
});
