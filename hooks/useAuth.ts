import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLLECTIONS, orchids } from '../lib/orchids';
import { useAuthStore, User, UserRole } from '../stores/authStore';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setAuth, logout: clearAuth } = useAuthStore();

    const login = async (email: string, pass: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orchids.auth.signInWithEmail(email, pass);
            if (response.user) {
                // Fetch user details including role from the users collection
                const userDoc = await orchids.db.collection(COLLECTIONS.USERS).doc(response.user.id).get();
                const userData = userDoc.data() as User;

                setAuth(userData, 'dummy-token'); // Orchids token handling might vary

                if (userData.role === 'admin') {
                    router.replace('/admin');
                } else {
                    router.replace('/(patient)');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Giriş yapılamadı.');
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, phone: string, pass: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orchids.auth.signUpWithEmail(email, pass);
            if (response.user) {
                const userData = {
                    id: response.user.id,
                    email,
                    full_name: name,
                    phone,
                    role: 'patient' as UserRole,
                    created_at: new Date().toISOString(),
                };

                // Save user details to our collection
                await orchids.db.collection(COLLECTIONS.USERS).doc(response.user.id).set(userData);

                setAuth(userData, 'dummy-token');
                router.replace('/(patient)');
            }
        } catch (err: any) {
            setError(err.message || 'Kayıt olunamadı.');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await orchids.auth.signOut();
        clearAuth();
        router.replace('/auth/login');
    };

    return { login, register, logout, loading, error };
};
