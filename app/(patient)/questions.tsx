import { Audio } from 'expo-av';
import { Stack, useRouter } from 'expo-router';
import { Mic, Send, Square } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { theme } from '../../constants/theme';
import { COLLECTIONS, orchids } from '../../lib/orchids';
import { useAuthStore } from '../../stores/authStore';

export default function QuestionsScreen() {
    const [view, setView] = useState<'ask' | 'history'>('ask');
    const [questionType, setQuestionType] = useState<'text' | 'audio'>('text');
    const [textContent, setTextContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [pastQuestions, setPastQuestions] = useState<any[]>([]);
    const { user } = useAuthStore();
    const router = useRouter();

    // Recording state
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        if (view === 'history') {
            fetchHistory();
        }
    }, [view]);

    const fetchHistory = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const docs = await orchids.db
                .collection(COLLECTIONS.QUESTIONS)
                .where('user_id', '==', user.id)
                .orderBy('created_at', 'desc')
                .get();
            setPastQuestions(docs.docs.map((d: any) => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
                setIsRecording(true);
            }
        } catch (err) {
            Alert.alert('Hata', 'Ses kaydı başlatılamadı.');
        }
    };

    const stopRecording = async () => {
        setRecording(null);
        setIsRecording(false);
        try {
            if (recording) {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setRecordingUri(uri);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        if (questionType === 'text' && !textContent.trim()) {
            Alert.alert('Hata', 'Lütfen sorunuzu yazın.');
            return;
        }
        if (questionType === 'audio' && !recordingUri) {
            Alert.alert('Hata', 'Lütfen önce bir ses kaydı alın.');
            return;
        }

        setLoading(true);
        try {
            let audio_url = '';
            if (questionType === 'audio' && recordingUri) {
                audio_url = 'temp_audio_url_placeholder';
            }

            await orchids.db.collection(COLLECTIONS.QUESTIONS).add({
                user_id: user.id,
                type: questionType,
                content: textContent,
                audio_url,
                status: 'pending',
                answer: '',
                created_at: new Date().toISOString(),
            });

            Alert.alert('Başarılı', 'Sorunuz uzmana iletildi.');
            setTextContent('');
            setRecordingUri(null);
            setQuestionType('text');
        } catch (err) {
            Alert.alert('Hata', 'Soru gönderilemedi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: 'Uzmana Sor', headerShown: true }} />

            <Box padding="lg" direction="row" gap="md">
                <TouchableOpacity
                    style={[styles.tab, view === 'ask' && styles.activeTab]}
                    onPress={() => setView('ask')}
                >
                    <Text weight="600" style={view === 'ask' ? { color: theme.colors.primary } : undefined}>Yeni Soru</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, view === 'history' && styles.activeTab]}
                    onPress={() => setView('history')}
                >
                    <Text weight="600" style={view === 'history' ? { color: theme.colors.primary } : undefined}>Geçmişim</Text>
                </TouchableOpacity>
            </Box>

            {view === 'ask' ? (
                <ScrollView contentContainerStyle={styles.scroll}>
                    <Box padding="lg" gap="xl">
                        <Box direction="row" gap="md">
                            <TouchableOpacity
                                style={[styles.typeBtn, questionType === 'text' && styles.activeType]}
                                onPress={() => setQuestionType('text')}
                            >
                                <Send size={24} color={questionType === 'text' ? theme.colors.primary : theme.colors.textSecondary} />
                                <Text>Yazılı</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.typeBtn, questionType === 'audio' && styles.activeType]}
                                onPress={() => setQuestionType('audio')}
                            >
                                <Mic size={24} color={questionType === 'audio' ? theme.colors.primary : theme.colors.textSecondary} />
                                <Text>Sesli</Text>
                            </TouchableOpacity>
                        </Box>

                        {questionType === 'text' ? (
                            <Input
                                label="Sorunuz"
                                value={textContent}
                                onChangeText={setTextContent}
                                placeholder="Buraya yazın..."
                            />
                        ) : (
                            <Box align="center" gap="lg" style={styles.audioSection}>
                                {isRecording ? (
                                    <TouchableOpacity onPress={stopRecording} style={[styles.micBtn, styles.recording]}>
                                        <Square size={32} color="#fff" fill="#fff" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={startRecording} style={styles.micBtn}>
                                        <Mic size={32} color="#fff" />
                                    </TouchableOpacity>
                                )}
                                <Text color="textSecondary">
                                    {isRecording ? 'Kaydediliyor...' : recordingUri ? 'Ses kaydedildi.' : 'Kaydetmek için basınız'}
                                </Text>
                                {recordingUri && !isRecording && (
                                    <Button title="Tekrar Çek" variant="outline" size="sm" onPress={() => setRecordingUri(null)} />
                                )}
                            </Box>
                        )}

                        <Button title="Gönder" onPress={handleSubmit} loading={loading} />
                    </Box>
                </ScrollView>
            ) : (
                <FlatList
                    data={pastQuestions}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <Card style={styles.historyCard} padding="md">
                            <Box gap="sm">
                                <Box direction="row" justify="space-between">
                                    <Text variant="sm" color="textSecondary">
                                        {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                    </Text>
                                    <Box
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: item.status === 'pending' ? theme.colors.warning + '20' : theme.colors.success + '20' }
                                        ]}
                                    >
                                        <Text variant="xs" color={item.status === 'pending' ? 'warning' : 'success'}>
                                            {item.status === 'pending' ? 'Beklemede' : 'Yanıtlandı'}
                                        </Text>
                                    </Box>
                                </Box>
                                <Text weight="500" numberOfLines={2}>
                                    {item.type === 'text' ? item.content : '🎤 Sesli Soru'}
                                </Text>
                                {item.answer && (
                                    <Box style={styles.answerBox}>
                                        <Text variant="sm" weight="700" color="primary">Yanıt:</Text>
                                        <Text variant="sm">{item.answer}</Text>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    )}
                    ListEmptyComponent={() => (
                        <Box padding="xl" align="center">
                            <Text color="textSecondary">Henüz bir sorunuz bulunmuyor.</Text>
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
    scroll: {
        paddingBottom: theme.spacing.xl,
    },
    tab: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: theme.colors.primary,
    },
    typeBtn: {
        flex: 1,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: theme.colors.surface,
    },
    activeType: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    audioSection: {
        paddingVertical: theme.spacing.xl,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        width: '100%',
    },
    micBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recording: {
        backgroundColor: theme.colors.error,
    },
    list: {
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    historyCard: {
        marginBottom: theme.spacing.xs,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    answerBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        marginTop: theme.spacing.xs,
        gap: 4,
    },
});
