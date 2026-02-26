import { Redirect } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function Index() {
    const { user } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (user) {
        if (user.role === 'admin') {
            return <Redirect href="/admin" />;
        }
        return <Redirect href="/(patient)" />;
    }

    return <Redirect href="/auth/login" />;

    return null;
}
