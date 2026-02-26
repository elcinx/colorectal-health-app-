import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { theme } from '../../constants/theme';
import { COLLECTIONS, orchids } from '../../lib/orchids';

export default function InfoPageScreen() {
    const { type } = useLocalSearchParams();
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docs = await orchids.db
                    .collection(COLLECTIONS.INFO_PAGES)
                    .where('type', '==', type)
                    .limit(1)
                    .get();

                if (!docs.empty) {
                    setContent(docs.docs[0].data());
                } else {
                    // Fallback static content for demo if not in DB
                    setContent(getFallbackContent(type as string));
                }
            } catch (err) {
                console.error(err);
                setContent(getFallbackContent(type as string));
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [type]);

    const getFallbackContent = (t: string) => {
        if (t === 'general') {
            return {
                title: 'Kolorektal Kanser Hakkında',
                content: `Kolorektal Kanser Risk Faktörleri Nelerdir?\n\n• Yaş: Genellikle 50 yaş üstü kişilerde görülür.\n• Aşırı kilolu veya obez olmak.\n• Fiziksel olarak aktif olmamak.\n• Fazla miktarda işlenmiş et tüketimi.\n• Sigara ve alkol kullanımı.\n• Kalın bağırsakta polip olması.\n• Ülseratif kolit veya Crohn hastalığı.\n• Ailede kalın bağırsak kanseri geçmişi.\n• Tip 2 diyabet hastası olmak.`
            };
        }
        return {
            title: 'Covid-19 Bilgilendirme',
            content: 'Kanser hastaları için Covid-19 aşısı ve korunma yöntemleri hakkında güncel bilgiler yakında burada olacaktır.'
        };
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: content?.title || 'Bilgilendirme', headerShown: true }} />
            {loading ? (
                <Box flex={1} justify="center" align="center">
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </Box>
            ) : (
                <ScrollView contentContainerStyle={styles.scroll}>
                    <Box padding="lg" gap="lg">
                        <Text variant="xxl" weight="700" color="primary">{content?.title}</Text>
                        <Text variant="md" style={styles.textContent}>{content?.content}</Text>
                    </Box>
                </ScrollView>
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
    textContent: {
        lineHeight: 24,
    },
});
