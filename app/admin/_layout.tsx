import { Stack } from 'expo-router';
import React from 'react';
import { theme } from '../../constants/theme';

export default function AdminLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTitleStyle: {
                    fontFamily: theme.typography.fontFamily,
                    color: theme.colors.text,
                },
                headerTintColor: theme.colors.primary,
                contentStyle: {
                    backgroundColor: theme.colors.background,
                },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Admin Paneli', headerShown: false }} />
            <Stack.Screen name="questions" options={{ title: 'Sorular' }} />
            <Stack.Screen name="patients/index" options={{ title: 'Hasta Listesi' }} />
            <Stack.Screen name="patients/[id]" options={{ title: 'Hasta Detayı' }} />
        </Stack>
    );
}
