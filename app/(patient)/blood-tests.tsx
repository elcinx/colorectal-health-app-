import { Stack } from 'expo-router';
import { ArrowDown, ArrowUp, Minus, Plus } from 'lucide-react-native';
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

export default function BloodTestsScreen() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const { user } = useAuthStore();

    // Form state
    const [testName, setTestName] = useState('');
    const [testDate, setTestDate] = useState(new Date().toLocaleDateString('tr-TR'));
    const [testValue, setTestValue] = useState('');
    const [testUnit, setTestUnit] = useState('');
    const [minVal, setMinVal] = useState('');
    const [maxVal, setMaxVal] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const docs = await orchids.db
                .collection(COLLECTIONS.BLOOD_TESTS)
                .where('user_id', '==', user.id)
                .orderBy('date', 'desc')
                .get();
            setTests(docs.docs.map((d: any) => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        if (!testName || !testValue) {
            Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        setSaving(true);
        try {
            await orchids.db.collection(COLLECTIONS.BLOOD_TESTS).add({
                user_id: user.id,
                test_name: testName,
                date: testDate,
                value: parseFloat(testValue),
                unit: testUnit,
                normal_min: parseFloat(minVal) || 0,
                normal_max: parseFloat(maxVal) || 0,
                created_at: new Date().toISOString(),
            });
            setModalVisible(false);
            fetchTests();
            resetForm();
        } catch (err) {
            Alert.alert('Hata', 'Tahlil kaydedilemedi.');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setTestName('');
        setTestValue('');
        setTestUnit('');
        setMinVal('');
        setMaxVal('');
    };

    const getStatus = (val: number, min: number, max: number) => {
        if (min === 0 && max === 0) return 'normal';
        if (val < min) return 'low';
        if (val > max) return 'high';
        return 'normal';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'high': return <ArrowUp size={16} color={theme.colors.error} />;
            case 'low': return <ArrowDown size={16} color={theme.colors.info} />;
            default: return <Minus size={16} color={theme.colors.success} />;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{
                title: 'Kan Tahlili',
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
                    data={tests}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        const status = getStatus(item.value, item.normal_min, item.normal_max);
                        return (
                            <Card style={styles.testCard} padding="md">
                                <Box direction="row" justify="space-between" align="center">
                                    <Box gap="xs" flex={1}>
                                        <Text weight="700">{item.test_name}</Text>
                                        <Text variant="sm" color="textSecondary">{item.date}</Text>
                                    </Box>
                                    <Box align="flex-end" gap="xs">
                                        <Box direction="row" align="center" gap="xs">
                                            {getStatusIcon(status)}
                                            <Text variant="lg" weight="700" color={status === 'normal' ? 'success' : status === 'high' ? 'error' : 'info'}>
                                                {item.value} {item.unit}
                                            </Text>
                                        </Box>
                                        {(item.normal_min > 0 || item.normal_max > 0) && (
                                            <Text variant="xs" color="textSecondary">
                                                Normal: {item.normal_min}-{item.normal_max}
                                            </Text>
                                        )}
                                    </Box>
                                </Box>
                            </Card>
                        );
                    }}
                    ListEmptyComponent={() => (
                        <Box padding="xl" align="center">
                            <Text color="textSecondary">Henüz tahlil sonucu eklemediniz.</Text>
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
                                <Text variant="xl" weight="700">Yeni Tahlil Ekle</Text>
                                <Input label="Tahlil Adı" value={testName} onChangeText={setTestName} placeholder="Örn: Hemoglobin" />
                                <Input label="Tarih" value={testDate} onChangeText={setTestDate} placeholder="GG.AA.YYYY" />

                                <Box direction="row" gap="md">
                                    <Box flex={1}>
                                        <Input label="Sonuç" value={testValue} onChangeText={setTestValue} placeholder="12.5" keyboardType="numeric" />
                                    </Box>
                                    <Box flex={1}>
                                        <Input label="Birim" value={testUnit} onChangeText={setTestUnit} placeholder="g/dL" />
                                    </Box>
                                </Box>

                                <Box direction="row" gap="md">
                                    <Box flex={1}>
                                        <Input label="Normal Min" value={minVal} onChangeText={setMinVal} placeholder="10" keyboardType="numeric" />
                                    </Box>
                                    <Box flex={1}>
                                        <Input label="Normal Max" value={maxVal} onChangeText={setMaxVal} placeholder="18" keyboardType="numeric" />
                                    </Box>
                                </Box>

                                <Box direction="row" gap="md" style={styles.modalBtns}>
                                    <Box flex={1}>
                                        <Button title="İptal" variant="outline" onPress={() => setModalVisible(false)} />
                                    </Box>
                                    <Box flex={1}>
                                        <Button title="Kaydet" onPress={handleSave} loading={saving} />
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
    testCard: {
        marginBottom: theme.spacing.xs,
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
    modalBtns: {
        marginTop: theme.spacing.lg,
    },
});
