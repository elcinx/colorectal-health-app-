import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';
import { Text } from './Base';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    loading?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const Button = ({
    onPress,
    title,
    variant = 'primary',
    loading = false,
    disabled = false,
    size = 'md',
    fullWidth = true,
    style,
}: ButtonProps) => {
    const getBackgroundColor = () => {
        if (disabled) return theme.colors.surface;
        switch (variant) {
            case 'primary': return theme.colors.primary;
            case 'secondary': return theme.colors.surface;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return theme.colors.primary;
        }
    };

    const getTextColor = (): any => {
        if (disabled) return 'textSecondary';
        switch (variant) {
            case 'outline': return 'primary';
            case 'ghost': return 'primary';
            default: return 'text';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                style,
                {
                    backgroundColor: getBackgroundColor(),
                    paddingVertical: size === 'sm' ? theme.spacing.sm : theme.spacing.md,
                    paddingHorizontal: theme.spacing.lg,
                    width: fullWidth ? '100%' : 'auto',
                    borderWidth: variant === 'outline' ? 1 : 0,
                    borderColor: theme.colors.primary,
                },
            ]}
        >
            {loading ? (
                <ActivityIndicator color={theme.colors.text} />
            ) : (
                <Text variant={size} weight="600" color={getTextColor()}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
