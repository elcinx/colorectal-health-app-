import { Stack } from 'expo-router';
import { Plus, User, UserCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { theme } from '../../constants/theme';
import { COLLECTIONS, orchids } from '../../lib/orchids';
import { useAuthStore } from '../../stores/authStore';

export default function ExperienceScreen() {
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const { user } = useAuthStore();

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const docs = await orchids.db
                .collection(COLLECTIONS.EXPERIENCES)
                .orderBy('created_at', 'desc')
                .get();
            setExperiences(docs.docs.map((d: any) => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        if (!title || !content) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        setSaving(true);
        try {
            await orchids.db.collection(COLLECTIONS.EXPERIENCES).add({
                user_id: user.id,
                user_name: user.full_name,
                title,
                content,
                is_anonymous: isAnonymous,
                created_at: new Date().toISOString(),
            });
            setModalVisible(false);
            fetchExperiences();
            resetForm();
        } catch (err) {
            Alert.alert('Hata', 'Deneyim paylaşılamadı.');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setIsAnonymous(false);
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{
                title: 'Hasta Deneyimleri',
                headerShown: true,
                headerRight: () => (
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
                        <Plus size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                )
            }} />

            {loading ? (
                <Box flex={1} justify="center" align="center">
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                </Box>
            ) : (
                <FlatList
                    data={experiences}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <Card style={styles.experienceCard} padding="lg">
                            <Box gap="md">
                                <Box direction="row" justify="space-between" align="center">
                                    <Text variant="lg" weight="700" color="primary">{item.title}</Text>
                                    <Box direction="row" align="center" gap="xs">
                                        {item.is_anonymous ? <User size={14} color={theme.colors.textSecondary} /> : <UserCheck size={14} color={theme.colors.success} />}
                                        <Text variant="xs" color="textSecondary">{item.is_anonymous ? 'Anonim' : item.user_name}</Text>
                                    </Box>
                                </Box>
                                <Text variant="md" style={styles.textContent}>{item.content}</Text>
                                <Text variant="xs" color="textSecondary" style={{ textAlign: 'right' }}>
                                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                </Text>
                            </Box>
                        </Card>
                    )}
                    ListEmptyComponent={() => (
                        <Box padding="xl" align="center">
                            <Text color="textSecondary">Henüz bir deneyim paylaşılmamış.</Text>
                        </Box>
                    )}
                />
            )}

            {/* Add Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <SafeAreaView style={styles.modalBg}>
                    <Box flex={1} style={styles.modalContent}>
                        <ScrollView contentContainerStyle={styles.modalScroll}>
                            <Box padding="lg" gap="md">
                                <Text variant="xl" weight="700">Deneyiminizi Paylaşın</Text>
                                <Input label="Başlık" value={title} onChangeText={setTitle} placeholder="Deneyim başlığı" />
                                <Input
                                    label="Anlatın"
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="Diğer hastalara ışık tutun..."
                                />
                                <Box direction="row" justify="space-between" align="center" style={styles.switchRow}>
                                    <Text weight="600">Anonim Paylaş</Text>
                                    <Switch
                                        value={isAnonymous}
                                        onValueChange={setIsAnonymous}
                                        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                    />
                                </Box>
                                <Box direction="row" gap="md" style={styles.modalBtns}>
                                    <Box flex={1}>
                                        <Button title="İptal" variant="outline" onPress={() => setModalVisible(false)} />
                                    </Box>
                                    <Box flex={1}>
                                        <Button title="Paylaş" onPress={handleSave} loading={saving} />
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
    experienceCard: {
        marginBottom: theme.spacing.xs,
    },
    textContent: {
        lineHeight: 22,
    },
    addBtn: {
        padding: 8,
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
    modalScroll: {
        paddingBottom: 40,
    },
    switchRow: {
        paddingVertical: theme.spacing.md,
    },
    modalBtns: {
        marginTop: theme.spacing.lg,
    },
});
