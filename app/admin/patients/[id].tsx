import { Stack, useLocalSearchParams } from 'expo-router';
import { Clock, Droplets, User } from 'lucide-react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../../components/ui/Base';
import { Card } from '../../../components/ui/Card';
import { theme } from '../../../constants/theme';
import { COLLECTIONS, orchids } from '../../../lib/orchids';

export default function AdminPatientDetailScreen() {
    const { id } = useLocalSearchParams();
    const [patient, setPatient] = useState<any>(null);
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [bloodTests, setBloodTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const patientDoc = await orchids.db.collection(COLLECTIONS.USERS).doc(id as string).get();
            if (patientDoc.exists) {
                setPatient(patientDoc.data());
            }

            const symptomDocs = await orchids.db
                .collection(COLLECTIONS.SYMPTOM_RECORDS)
                .where('user_id', '==', id)
                .orderBy('recorded_at', 'desc')
                .get();
            setSymptoms(symptomDocs.docs.map((d: any) => ({ id: d.id, ...d.data() })));

            const bloodDocs = await orchids.db
                .collection(COLLECTIONS.BLOOD_TESTS)
                .where('user_id', '==', id)
                .orderBy('date', 'desc')
                .get();
            setBloodTests(bloodDocs.docs.map((d: any) => ({ id: d.id, ...d.data() })));

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: patient?.full_name || 'Hasta Detayı', headerShown: true }} />

            {loading ? (
                <Box flex={1} justify="center" align="center">
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </Box>
            ) : (
                <ScrollView contentContainerStyle={styles.scroll}>
                    <Box padding="lg" gap="lg">
                        {/* Patient Info Card */}
                        <Card padding="lg" style={styles.infoCard}>
                            <Box direction="row" align="center" gap="md">
                                <Box style={styles.avatarBox}>
                                    <User size={30} {...({ color: theme.colors.primary } as any)} />
                                </Box>
                                <Box>
                                    <Text variant="xl" weight="700">{patient?.full_name}</Text>
                                    <Text variant="sm" color="textSecondary">{patient?.email}</Text>
                                    <Text variant="sm" color="textSecondary">{patient?.phone || 'Telefon Yok'}</Text>
                                </Box>
                            </Box>
                        </Card>

                        {/* Recent Symptoms */}
                        <Box gap="md">
                            <Box direction="row" align="center" gap="sm">
                                <Clock size={20} {...({ color: theme.colors.warning } as any)} />
                                <Text variant="lg" weight="700">Belirti Kayıtları</Text>
                            </Box>
                            {symptoms.length > 0 ? (
                                symptoms.map(s => (
                                    <Card key={s.id} padding="md">
                                        <Box direction="row" justify="space-between">
                                            <Box gap="xs" flex={1}>
                                                <Text weight="700">{s.symptom_name}</Text>
                                                <Text variant="xs" color="textSecondary">
                                                    {new Date(s.recorded_at).toLocaleDateString('tr-TR')} {new Date(s.recorded_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                                <Text variant="sm">{s.note || 'Not düşülmemiş'}</Text>
                                            </Box>
                                            <Box style={[styles.severityBadge, { backgroundColor: getSeverityColor(s.severity) }]}>
                                                <Text weight="700" style={{ color: '#fff' }}>{s.severity}</Text>
                                            </Box>
                                        </Box>
                                    </Card>
                                ))
                            ) : (
                                <Text color="textSecondary">Henüz belirti kaydı yok.</Text>
                            )}
                        </Box>

                        {/* Blood Tests */}
                        <Box gap="md">
                            <Box direction="row" align="center" gap="sm">
                                <Droplets size={20} {...({ color: theme.colors.info } as any)} />
                                <Text variant="lg" weight="700">Kan Tahlilleri</Text>
                            </Box>
                            {bloodTests.length > 0 ? (
                                bloodTests.map(t => (
                                    <Card key={t.id} padding="md">
                                        <Box direction="row" justify="space-between" align="center">
                                            <Box gap="xs">
                                                <Text weight="700">{t.test_name}</Text>
                                                <Text variant="xs" color="textSecondary">{t.date}</Text>
                                            </Box>
                                            <Text variant="lg" weight="700" color="primary">{t.value} {t.unit}</Text>
                                        </Box>
                                    </Card>
                                ))
                            ) : (
                                <Text color="textSecondary">Henüz tahlil sonucu yok.</Text>
                            )}
                        </Box>
                    </Box>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const getSeverityColor = (s: number) => {
    if (s <= 3) return '#66BB6A';
    if (s <= 7) return '#FFCA28';
    return '#EF5350';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scroll: {
        paddingBottom: theme.spacing.xl,
    },
    infoCard: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.primary + '30',
        borderWidth: 1,
    },
    avatarBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    severityBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
