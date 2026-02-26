import { Tabs } from 'expo-router';
import { Calendar, Home, MessageSquare, User } from 'lucide-react-native';
import React from 'react';
import { theme } from '../../constants/theme';

export default function PatientLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                    height: 60,
                    paddingBottom: 10,
                },
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTitleStyle: {
                    fontFamily: theme.typography.fontFamily,
                    color: theme.colors.text,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="questions"
                options={{
                    title: 'Uzmana Sor',
                    tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Takvim',
                    tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
            <Tabs.Screen name="symptoms/index" options={{ href: null, title: 'Belirtiler' }} />
            <Tabs.Screen name="symptoms/[id]" options={{ href: null, title: 'Belirti Detay' }} />
            <Tabs.Screen name="experience" options={{ href: null, title: 'Deneyimler' }} />
            <Tabs.Screen name="blood-tests" options={{ href: null, title: 'Kan Tahlili' }} />
            <Tabs.Screen name="recommendations" options={{ href: null, title: 'Öneriler' }} />
            <Tabs.Screen name="about" options={{ href: null, title: 'Hakkında' }} />
        </Tabs>
    );
}
