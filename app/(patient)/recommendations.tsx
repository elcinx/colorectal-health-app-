import { Stack, useRouter } from 'expo-router';
import { AlertTriangle, ChevronRight, Lightbulb } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { theme } from '../../constants/theme';
import { COLLECTIONS, orchids } from '../../lib/orchids';

export default function RecommendationsScreen() {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const docs = await orchids.db.collection(COLLECTIONS.RECOMMENDATIONS).get();
            if (!docs.empty) {
                setRecommendations(docs.docs.map((d: any) => ({ id: d.id, ...d.data() })));
            } else {
                setRecommendations(getFallbackRecommendations());
            }
        } catch (err) {
            setRecommendations(getFallbackRecommendations());
        } finally {
            setLoading(false);
        }
    };

    const getFallbackRecommendations = () => [
        {
            id: 'r1',
            category: 'Bulantı & Kusma',
            content: '• Az az ve sık sık beslenin.\n• Yemeklerden sonra 30-60 dakika dik oturun.\n• Yağlı ve ağır kokulu gıdalardan kaçının.',
            when_to_see_doctor: 'Günde 3 kereden fazla kusuyorsanız veya 24 saat boyunca sıvı alamadıysanız mutlaka doktorunuza başvurun.'
        },
        {
            id: 'r2',
            category: 'İştahsızlık',
            content: '• Yüksek proteinli gıdalar tüketin.\n• Yemekleri daha iştah açıcı sunumlara dönüştürün.\n• Gerekirse doktorun önerdiği besin takviyelerini kullanın.',
            when_to_see_doctor: 'Kısa sürede belirgin kilo kaybı yaşıyorsanız doktorunuza danışın.'
        },
        {
            id: 'r5',
            category: 'Ağrı',
            content: '• Ağrı kesicilerinizi saatinde kullanın.\n• Gevşeme egzersizleri yapın.\n• Ağrının yerini ve şiddetini takip edin.',
            when_to_see_doctor: 'Aniden gelişen ve ilaçla dinmeyen şiddetli ağrınız varsa acil servise başvurun.'
        }
    ];

    if (selectedCategory) {
        return (
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <Stack.Screen options={{ title: selectedCategory.category, headerShown: true }} />
                <ScrollView contentContainerStyle={styles.scroll}>
                    <Box padding="lg" gap="lg">
                        <Card padding="lg">
                            <Box gap="md">
                                <Box direction="row" align="center" gap="sm">
                                    <Lightbulb size={24} color={theme.colors.warning} />
                                    <Text variant="lg" weight="700">Yönetim Önerileri</Text>
                                </Box>
                                <Text variant="md" style={styles.textContent}>{selectedCategory.content}</Text>
                            </Box>
                        </Card>

                        <Card padding="lg" style={{ borderColor: theme.colors.error, borderLeftWidth: 4 }}>
                            <Box gap="md">
                                <Box direction="row" align="center" gap="sm">
                                    <AlertTriangle size={24} color={theme.colors.error} />
                                    <Text variant="lg" weight="700" color="error">Ne Zaman Doktora Başvurulmalı?</Text>
                                </Box>
                                <Text variant="md" weight="500">{selectedCategory.when_to_see_doctor}</Text>
                            </Box>
                        </Card>

                        <Button title="Geri Dön" variant="outline" onPress={() => setSelectedCategory(null)} />
                    </Box>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: 'Öneriler', headerShown: true }} />
            {loading ? (
                <Box flex={1} justify="center" align="center">
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </Box>
            ) : (
                <FlatList
                    data={recommendations}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedCategory(item)}>
                            <Card style={styles.categoryCard} padding="md">
                                <Box direction="row" justify="space-between" align="center">
                                    <Text variant="md" weight="600">{item.category}</Text>
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
    scroll: {
        paddingBottom: theme.spacing.xl,
    },
    list: {
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    categoryCard: {
        marginBottom: theme.spacing.xs,
    },
    textContent: {
        lineHeight: 24,
    },
});
