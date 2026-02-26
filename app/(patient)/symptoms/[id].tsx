import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Lightbulb } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../../components/ui/Base';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { theme } from '../../../constants/theme';
import { COLLECTIONS, orchids } from '../../../lib/orchids';
import { useAuthStore } from '../../../stores/authStore';

export default function SymptomDetailScreen() {
    const { id, name } = useLocalSearchParams();
    const { user } = useAuthStore();
    const router = useRouter();

    const [symptom, setSymptom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [severity, setSeverity] = useState(5);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSymptomDetails = async () => {
            try {
                const doc = await orchids.db.collection(COLLECTIONS.SYMPTOMS).doc(id as string).get();
                if (doc.exists) {
                    setSymptom(doc.data());
                } else {
                    setSymptom(getFallbackDetails(id as string));
                }
            } catch (err) {
                setSymptom(getFallbackDetails(id as string));
            } finally {
                setLoading(false);
            }
        };
        fetchSymptomDetails();
    }, [id]);

    const getFallbackDetails = (sid: string) => ({
        name: name,
        description: `Bu belirti hakkında genel bilgilendirme: ${name} yönetimi için aşağıdaki önerileri dikkate alabilirsiniz.`,
        tips: '• Bol sıvı tüketin.\n• Az az ve sık sık yemek yiyin.\n• Dinlenmeye özen gösterin.\n• Belirtiler şiddetlenirse doktorunuza başvurun.'
    });

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await orchids.db.collection(COLLECTIONS.SYMPTOM_RECORDS).add({
                user_id: user.id,
                symptom_id: id,
                symptom_name: name,
                severity,
                note,
                recorded_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            });
            Alert.alert('Başarılı', 'Belirti kaydı başarıyla oluşturuldu.', [
                { text: 'Tamam', onPress: () => router.back() }
            ]);
        } catch (err) {
            Alert.alert('Hata', 'Kayıt sırasında bir sorun oluştu.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: name as string, headerShown: true }} />
            {loading ? (
                <Box flex={1} justify="center" align="center">
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </Box>
            ) : (
                <ScrollView contentContainerStyle={styles.scroll}>
                    <Box padding="lg" gap="lg">
                        {/* description & tips */}
                        <Card padding="lg">
                            <Box gap="md">
                                <Box direction="row" align="center" gap="sm">
                                    <Lightbulb size={24} color={theme.colors.warning} />
                                    <Text variant="lg" weight="700">Yönetim Önerileri</Text>
                                </Box>
                                <Text variant="md">{symptom?.tips}</Text>
                            </Box>
                        </Card>

                        {/* Severity scale */}
                        <Box gap="md" style={styles.section}>
                            <Text variant="lg" weight="700">Şiddet Düzeyi (1-10)</Text>
                            <Text variant="sm" color="textSecondary">Yaşadığınız belirtinin şiddetini seçin:</Text>
                            <View style={styles.severityGrid}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        onPress={() => setSeverity(num)}
                                        style={[
                                            styles.severityButton,
                                            severity === num && { backgroundColor: theme.colors.primary }
                                        ]}
                                    >
                                        <Text
                                            weight="700"
                                            style={[severity === num && { color: '#fff' }]}
                                        >
                                            {num}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Box>

                        {/* Note input */}
                        <Box gap="md" style={styles.section}>
                            <Text variant="lg" weight="700">Not Ekle (İsteğe Bağlı)</Text>
                            <Input
                                value={note}
                                onChangeText={setNote}
                                placeholder="Nasıl hissediyorsunuz? Eklemek istediğiniz bir not var mı?"
                                style={styles.textArea}
                            />
                        </Box>

                        <Button
                            title="Kaydet"
                            onPress={handleSave}
                            loading={saving}
                            variant="primary"
                        />
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
    section: {
        marginBottom: theme.spacing.md,
    },
    severityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: theme.spacing.sm,
    },
    severityButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: theme.spacing.sm,
    },
});
