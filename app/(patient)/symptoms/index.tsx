import { Stack, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../../components/ui/Base';
import { Card } from '../../../components/ui/Card';
import { theme } from '../../../constants/theme';
import { COLLECTIONS, orchids } from '../../../lib/orchids';

export default function SymptomsListScreen() {
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSymptoms = async () => {
            try {
                const docs = await orchids.db.collection(COLLECTIONS.SYMPTOMS).get();
                if (!docs.empty) {
                    setSymptoms(docs.docs.map((d: any) => ({ id: d.id, ...d.data() })));
                } else {
                    setSymptoms(getFallbackSymptoms());
                }
            } catch (err) {
                setSymptoms(getFallbackSymptoms());
            } finally {
                setLoading(false);
            }
        };
        fetchSymptoms();
    }, []);

    const getFallbackSymptoms = () => [
        { id: '1', name: 'Bulantı & Kusma', icon: 'nausea' },
        { id: '2', name: 'İştahsızlık', icon: 'appetite' },
        { id: '3', name: 'Enfeksiyon', icon: 'infection' },
        { id: '4', name: 'Kanama', icon: 'bleeding' },
        { id: '5', name: 'Ağrı', icon: 'pain' },
        { id: '6', name: 'Saç Dökülmesi', icon: 'hair' },
        { id: '7', name: 'Yorgunluk ve Halsizlik', icon: 'fatigue' },
        { id: '8', name: 'Ağız Yaraları', icon: 'mouth' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: 'Belirti Yönetimi', headerShown: true }} />
            {loading ? (
                <Box flex={1} justify="center" align="center">
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </Box>
            ) : (
                <FlatList
                    data={symptoms}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.push({ pathname: '/symptoms/[id]', params: { id: item.id, name: item.name } } as any)}>
                            <Card style={styles.card} padding="md">
                                <Box direction="row" justify="space-between" align="center">
                                    <Text variant="md" weight="600">{item.name}</Text>
                                    <ChevronRight size={20} color={theme.colors.textSecondary} />
                                </Box>
                            </Card>
                        </TouchableOpacity>
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
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    card: {
        marginBottom: theme.spacing.xs,
    },
});
