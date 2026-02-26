import { Stack } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Card } from '../../components/ui/Card';
import { theme } from '../../constants/theme';
import { COLLECTIONS, orchids } from '../../lib/orchids';
import { useAuthStore } from '../../stores/authStore';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();

    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetchRecordsForDate(selectedDate);
    }, [selectedDate]);

    const fetchRecordsForDate = async (date: Date) => {
        if (!user) return;
        setLoading(true);
        try {
            const dateStr = date.toISOString().split('T')[0];
            const startOfDay = new Date(dateStr).toISOString();
            const endOfDay = new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000 - 1).toISOString();

            const docs = await orchids.db
                .collection(COLLECTIONS.SYMPTOM_RECORDS)
                .where('user_id', '==', user.id)
                .where('recorded_at', '>=', startOfDay)
                .where('recorded_at', '<=', endOfDay)
                .get();

            setRecords(docs.docs.map((d: any) => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const changeMonth = (offset: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: 'Belirti Takvimi', headerShown: true }} />

            <ScrollView contentContainerStyle={styles.scroll}>
                <Box padding="lg" gap="lg">
                    <Card padding="md">
                        <Box direction="row" justify="space-between" align="center" style={{ marginBottom: 16 }}>
                            <TouchableOpacity onPress={() => changeMonth(-1)}>
                                <ChevronLeft color={theme.colors.primary} />
                            </TouchableOpacity>
                            <Text variant="lg" weight="700">
                                {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                            </Text>
                            <TouchableOpacity onPress={() => changeMonth(1)}>
                                <ChevronRight color={theme.colors.primary} />
                            </TouchableOpacity>
                        </Box>

                        <Box direction="row" justify="space-between" style={{ marginBottom: 8 }}>
                            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
                                <Text key={d} variant="xs" color="textSecondary" style={styles.dayLabel}>{d}</Text>
                            ))}
                        </Box>

                        <View style={styles.daysGrid}>
                            {getDaysInMonth(currentMonth).map((date, idx) => (
                                <View key={idx} style={styles.dayBox}>
                                    {date && (
                                        <TouchableOpacity
                                            onPress={() => setSelectedDate(date)}
                                            style={[
                                                styles.dayCircle,
                                                isSameDay(date, selectedDate) ? { backgroundColor: theme.colors.primary } : {}
                                            ]}
                                        >
                                            <Text
                                                variant="sm"
                                                weight="600"
                                                style={isSameDay(date, selectedDate) ? { color: '#fff' } : {}}
                                            >
                                                {date.getDate()}
                                            </Text>
                                            {isSameDay(date, new Date()) && !isSameDay(date, selectedDate) && (
                                                <View style={styles.todayDot} />
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>
                    </Card>

                    <Box gap="md">
                        <Text variant="lg" weight="700">
                            {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} Kayıtları
                        </Text>

                        {loading ? (
                            <ActivityIndicator color={theme.colors.primary} />
                        ) : records.length > 0 ? (
                            records.map(record => (
                                <Card key={record.id} padding="md">
                                    <Box direction="row" justify="space-between" align="center">
                                        <Box gap="xs">
                                            <Text weight="700">{record.symptom_name}</Text>
                                            <Text variant="sm" color="textSecondary">{record.note || 'Not eklenmedi'}</Text>
                                        </Box>
                                        <Box
                                            style={[styles.severityBadge, { backgroundColor: getSeverityColor(record.severity) }]}
                                        >
                                            <Text weight="700" style={{ color: '#fff' }}>{record.severity}</Text>
                                        </Box>
                                    </Box>
                                </Card>
                            ))
                        ) : (
                            <Box padding="xl" align="center">
                                <Text color="textSecondary">Bu tarihte kayıt bulunmuyor.</Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            </ScrollView>
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
    dayLabel: {
        width: 40,
        textAlign: 'center',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayBox: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    todayDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        bottom: 2,
    },
    severityBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
