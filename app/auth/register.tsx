import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../../components/ui/Base';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { register, loading, error } = useAuth();

    const handleRegister = () => {
        register(name, email, phone, password);
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
                            Kayıt Ol
                        </Text>
                        <Text variant="lg" color="textSecondary">
                            Sağlık yolculuğunuzda yanınızdayız
                        </Text>
                    </Box>

                    <Box gap="md" style={styles.form}>
                        <Input
                            label="İsim Soyisim"
                            value={name}
                            onChangeText={setName}
                            placeholder="Adınız ve Soyadınız"
                        />
                        <Input
                            label="E-posta"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="ornek@mail.com"
                            keyboardType="email-address"
                        />
                        <Input
                            label="Telefon"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="05XX XXX XX XX"
                            keyboardType="phone-pad"
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
                            title="Kayıt Ol"
                            onPress={handleRegister}
                            loading={loading}
                            style={styles.button}
                        />

                        <Box direction="row" justify="center" align="center" gap="xs">
                            <Text variant="sm" color="textSecondary">
                                Zaten hesabınız var mı?
                            </Text>
                            <Link href="/auth/login" asChild>
                                <Button title="Giriş Yap" variant="ghost" size="sm" fullWidth={false} onPress={() => { }} />
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
    button: {
        marginTop: theme.spacing.md,
    },
});
