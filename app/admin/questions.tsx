import { Stack } from 'expo-router';
import { CheckCircle, Clock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { theme } from '../../constants/theme';
import { COLLECTIONS, orchids } from '../../lib/orchids';
import { useAuthStore } from '../../stores/authStore';

export default function AdminQuestionsScreen() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
    const [answer, setAnswer] = useState('');
    const [saving, setSaving] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const docs = await orchids.db
                .collection(COLLECTIONS.QUESTIONS)
                .orderBy('created_at', 'desc')
                .get();
            setQuestions(docs.docs.map((d: any) => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async () => {
        if (!selectedQuestion || !answer.trim() || !user) return;
        setSaving(true);
        try {
            await orchids.db.collection(COLLECTIONS.QUESTIONS).doc(selectedQuestion.id).update({
                status: 'answered',
                answer: answer,
                answered_by: user.full_name,
                answered_at: new Date().toISOString(),
            });
            Alert.alert('Başarılı', 'Yanıt gönderildi.');
            setSelectedQuestion(null);
            setAnswer('');
            fetchQuestions();
        } catch (err) {
            Alert.alert('Hata', 'Yanıt gönderilemedi.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: 'Sorulan Sorular', headerShown: true }} />

            {loading ? (
                <Box flex={1} justify="center" align="center">
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </Box>
            ) : (
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedQuestion(item)}>
                            <Card style={styles.card} padding="md">
                                <Box gap="sm">
                                    <Box direction="row" justify="space-between" align="center">
                                        <Box direction="row" align="center" gap="xs">
                                            {item.status === 'pending' ? <Clock size={16} color={theme.colors.warning} /> : <CheckCircle size={16} color={theme.colors.success} />}
                                            <Text variant="xs" color={item.status === 'pending' ? 'warning' : 'success'}>
                                                {item.status === 'pending' ? 'Beklemede' : 'Yanıtlandı'}
                                            </Text>
                                        </Box>
                                        <Text variant="xs" color="textSecondary">
                                            {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                        </Text>
                                    </Box>
                                    <Text weight="700" color="primary">Soru:</Text>
                                    <Text weight="500" numberOfLines={2}>
                                        {item.type === 'text' ? item.content : '🎤 Sesli Soru'}
                                    </Text>
                                    {item.answer && (
                                        <Text variant="sm" color="textSecondary" numberOfLines={1}>Yanıt: {item.answer}</Text>
                                    )}
                                </Box>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Answer Modal */}
            <Modal visible={!!selectedQuestion} animationType="slide" transparent>
                <SafeAreaView style={styles.modalBg}>
                    <Box flex={1} style={styles.modalContent}>
                        <ScrollView>
                            <Box padding="lg" gap="lg">
                                <Text variant="xl" weight="700">Soruyu Yanıtla</Text>

                                <Box gap="sm">
                                    <Text weight="700" color="primary">Hastanın Sorusu:</Text>
                                    {selectedQuestion?.type === 'text' ? (
                                        <Text variant="md">{selectedQuestion?.content}</Text>
                                    ) : (
                                        <Box style={{ padding: 10, backgroundColor: theme.colors.surface, borderRadius: 8 }}>
                                            <Text>🎤 Sesli Soru (Oynatmak için bas)</Text>
                                        </Box>
                                    )}
                                </Box>

                                <Input
                                    label="Yanıtınız"
                                    value={answer}
                                    onChangeText={setAnswer}
                                    placeholder="Tıbbi tavsiye ve önerinizi yazın..."
                                />

                                <Box direction="row" gap="md" style={{ paddingBottom: 40 }}>
                                    <Box flex={1}>
                                        <Button title="Kapat" variant="outline" onPress={() => setSelectedQuestion(null)} />
                                    </Box>
                                    <Box flex={1}>
                                        <Button title="Yanıtla" onPress={handleAnswer} loading={saving} />
                                    </Box>
                                </Box>
                            </Box>
                        </ScrollView>
                    </Box>
                </SafeAreaView>
            </Modal>
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
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        marginTop: 100,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        overflow: 'hidden',
    },
});
