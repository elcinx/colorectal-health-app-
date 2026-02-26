import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const router = useRouter();

    const handleLogin = () => {
        login(email, password);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.colors.background, theme.colors.surface]}
                style={StyleSheet.absoluteFill}
            />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Box padding="xl" gap="xl">
                    <Box gap="sm" style={styles.header}>
                        <Text variant="title" weight="700" color="primary">
                            Kolorektal Kanser
                        </Text>
                        <Text variant="lg" color="textSecondary">
                            Dijital Sağlık Destek Uygulaması
                        </Text>
                    </Box>

                    <Box gap="md" style={styles.form}>
                        <Text variant="xxl" weight="600" style={styles.welcome}>
                            Tekrar Hoş Geldiniz
                        </Text>

                        <Input
                            label="E-posta"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="ornek@mail.com"
                            keyboardType="email-address"
                        />
                        <Input
                            label="Şifre"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            secureTextEntry
                        />

                        {error && (
                            <Text variant="sm" color="error">
                                {error}
                            </Text>
                        )}

                        <Button
                            title="Giriş Yap"
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.button}
                        />

                        <Box direction="row" justify="center" align="center" gap="xs">
                            <Text variant="sm" color="textSecondary">
                                Hesabınız yok mu?
                            </Text>
                            <Link href="/auth/register" asChild>
                                <Button title="Kayıt Ol" variant="ghost" size="sm" fullWidth={false} onPress={() => { }} />
                            </Link>
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
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    form: {
        backgroundColor: 'rgba(22, 22, 24, 0.5)',
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    welcome: {
        marginBottom: theme.spacing.md,
    },
    button: {
        marginTop: theme.spacing.md,
    },
});
