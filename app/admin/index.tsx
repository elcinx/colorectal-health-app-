import { useRouter } from 'expo-router';
import { ClipboardList, LogOut, MessageSquare, Users } from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Card } from '../../components/ui/Card';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
    const { user } = useAuthStore();
    const { logout } = useAuth();
    const router = useRouter();

    const menuItems = [
        { id: 'questions', title: 'Sorulan Sorular', icon: MessageSquare, color: '#42A5F5', path: '/admin/questions' },
        { id: 'patients', title: 'Hasta Listesi', icon: Users, color: '#66BB6A', path: '/admin/patients' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Box padding="lg" gap="lg">
                    <Box direction="row" justify="space-between" align="center">
                        <Box>
                            <Text variant="xl" weight="700" color="primary">Admin Paneli</Text>
                            <Text variant="md" color="textSecondary">Hoş geldiniz, {user?.full_name}</Text>
                        </Box>
                        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                            <LogOut size={20} color={theme.colors.error} />
                        </TouchableOpacity>
                    </Box>

                    <Box padding="lg" style={styles.statsCard}>
                        <Text variant="lg" weight="700">Özet Bilgiler</Text>
                        <Box direction="row" gap="md" style={{ marginTop: 16 }}>
                            <Box flex={1}>
                                <Card padding="md" style={styles.statBox}>
                                    <Box align="center">
                                        <Text variant="xxl" weight="700" color="primary">12</Text>
                                        <Text variant="xs" color="textSecondary">Bekleyen Soru</Text>
                                    </Box>
                                </Card>
                            </Box>
                            <Box flex={1}>
                                <Card padding="md" style={styles.statBox}>
                                    <Box align="center">
                                        <Text variant="xxl" weight="700" color="success">45</Text>
                                        <Text variant="xs" color="textSecondary">Toplam Hasta</Text>
                                    </Box>
                                </Card>
                            </Box>
                        </Box>
                    </Box>

                    <Box gap="md">
                        {menuItems.map((item) => (
                            <TouchableOpacity key={item.id} onPress={() => router.push(item.path as any)}>
                                <Card padding="lg" style={styles.menuCard}>
                                    <Box direction="row" align="center" gap="lg">
                                        <Box style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                                            <item.icon size={28} color={item.color} />
                                        </Box>
                                        <Box flex={1}>
                                            <Text variant="lg" weight="700">{item.title}</Text>
                                            <Text variant="sm" color="textSecondary">Tıklayarak detaylara gidin</Text>
                                        </Box>
                                        <ClipboardList size={20} color={theme.colors.textSecondary} />
                                    </Box>
                                </Card>
                            </TouchableOpacity>
                        ))}
                    </Box>
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
    logoutBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.surface,
    },
    statsCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        marginBottom: theme.spacing.md,
    },
    statBox: {
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    menuCard: {
        marginBottom: theme.spacing.xs,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
