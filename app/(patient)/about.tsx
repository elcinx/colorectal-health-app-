import { Stack } from 'expo-router';
import { FileText, Shield } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Card } from '../../components/ui/Card';
import { theme } from '../../constants/theme';

export default function AboutScreen() {
    const openLink = (url: string) => {
        // In a real app, uses Linking.openURL
        Alert.alert('Link', `Yönlendiriliyor: ${url}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: 'Hakkında', headerShown: true }} />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Box padding="lg" gap="lg">
                    <Box align="center" gap="sm" style={styles.header}>
                        <Text variant="title" weight="700" color="primary">Kolorektal Kanser</Text>
                        <Text variant="md" color="textSecondary">Versiyon 1.0.0</Text>
                    </Box>

                    <Card padding="lg">
                        <Box gap="md">
                            <Text weight="600">Uygulama Amacı</Text>
                            <Text variant="sm" style={styles.description}>
                                Bu uygulama, kolorektal kanser hastalarının tedavi süreçlerini kolaylaştırmak,
                                belirtilerini takip etmelerine yardımcı olmak ve uzmanlarla iletişimlerini
                                güçlendirmek amacıyla geliştirilmiştir.
                            </Text>
                        </Box>
                    </Card>

                    <Box gap="md">
                        <Text variant="lg" weight="700">Yasal Bilgiler</Text>
                        <TouchableOpacity onPress={() => openLink('https://example.com/privacy')}>
                            <Card padding="md">
                                <Box direction="row" align="center" gap="md">
                                    <Shield size={20} color={theme.colors.primary} />
                                    <Text weight="600">Gizlilik Politikası</Text>
                                </Box>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://example.com/terms')}>
                            <Card padding="md">
                                <Box direction="row" align="center" gap="md">
                                    <FileText size={20} color={theme.colors.primary} />
                                    <Text weight="600">Kullanım Koşulları</Text>
                                </Box>
                            </Card>
                        </TouchableOpacity>
                    </Box>

                    <Box align="center" style={styles.footer}>
                        <Text variant="xs" color="textSecondary">© 2026 Sağlık Teknolojileri A.Ş.</Text>
                        <Text variant="xs" color="textSecondary">Tüm hakları saklıdır.</Text>
                    </Box>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
}

import { Alert } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scroll: {
        paddingBottom: theme.spacing.xl,
    },
    header: {
        marginVertical: theme.spacing.xl,
    },
    description: {
        lineHeight: 20,
    },
    footer: {
        marginTop: theme.spacing.xl,
        gap: 4,
    },
});
