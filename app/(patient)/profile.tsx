import { Stack } from 'expo-router';
import { User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { theme } from '../../constants/theme';
import { COLLECTIONS, orchids } from '../../lib/orchids';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileScreen() {
    const { user, setAuth, token } = useAuthStore();
    const [name, setName] = useState(user?.full_name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const updatedUser = {
                ...user,
                full_name: name,
                phone: phone,
            };

            await orchids.db.collection(COLLECTIONS.USERS).doc(user.id).update({
                full_name: name,
                phone: phone,
            });

            setAuth(updatedUser, token || '');
            Alert.alert('Başarılı', 'Bilgileriniz güncellendi.');
        } catch (err) {
            Alert.alert('Hata', 'Bilgiler güncellenemedi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ title: 'Profil ve İletişim', headerShown: true }} />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Box padding="lg" gap="xl">
                    <Box align="center" gap="md" style={styles.avatarSection}>
                        <Box style={styles.avatarCircle}>
                            <User size={50} color={theme.colors.primary} />
                        </Box>
                        <Text variant="xxl" weight="700">{user?.full_name}</Text>
                        <Text variant="md" color="textSecondary">{user?.role === 'admin' ? 'Hemşire / Admin' : 'Hasta'}</Text>
                    </Box>

                    <Box gap="md" style={styles.formSection}>
                        <Input
                            label="İsim Soyisim"
                            value={name}
                            onChangeText={setName}
                            placeholder="Adınız Soyadınız"
                        />
                        <Input
                            label="E-posta"
                            value={user?.email || ''}
                            onChangeText={() => { }}
                            placeholder="e-posta"
                            keyboardType="email-address"
                        />
                        <Input
                            label="Telefon"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="05XX XXX XX XX"
                            keyboardType="phone-pad"
                        />

                        <Box style={{ marginTop: theme.spacing.md }}>
                            <Button
                                title="Değişiklikleri Kaydet"
                                onPress={handleUpdate}
                                loading={loading}
                            />
                        </Box>
                    </Box>
                </Box>
            </ScrollView>
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
    avatarSection: {
        marginVertical: theme.spacing.xl,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    formSection: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
});
