import { Stack, useRouter } from 'expo-router';
import { ChevronRight, User } from 'lucide-react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../../components/ui/Base';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { theme } from '../../../constants/theme';
import { COLLECTIONS, orchids } from '../../../lib/orchids';

export default function AdminPatientsScreen() {
    const [patients, setPatients] = useState<any[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter(p =>
                p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
                p.email?.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredPatients(filtered);
        }
    }, [search, patients]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const docs = await orchids.db
                .collection(COLLECTIONS.USERS)
                .where('role', '==', 'patient')
                .get();
            setPatients(docs.docs.map((d: any) => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: 'Hasta Listesi', headerShown: true }} />

            <Box padding="lg">
                <Input
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Hasta ara (İsim veya E-posta)..."
                />
            </Box>

            {loading ? (
                <Box flex={1} justify="center" align="center">
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </Box>
            ) : (
                <FlatList
                    data={filteredPatients}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.push(`/admin/patients/${item.id}` as any)}>
                            <Card style={styles.card} padding="md">
                                <Box direction="row" align="center" gap="md">
                                    <Box style={styles.avatarBox}>
                                        <User size={24} {...({ color: theme.colors.primary } as any)} />
                                    </Box>
                                    <Box flex={1}>
                                        <Text weight="700">{item.full_name}</Text>
                                        <Text variant="xs" color="textSecondary">{item.email}</Text>
                                    </Box>
                                    <ChevronRight size={20} {...({ color: theme.colors.textSecondary } as any)} />
                                </Box>
                            </Card>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <Box padding="xl" align="center">
                            <Text color="textSecondary">Hasta bulunamadı.</Text>
                        </Box>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    list: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
        gap: theme.spacing.sm,
    },
    card: {
        marginBottom: theme.spacing.xs,
    },
    avatarBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
