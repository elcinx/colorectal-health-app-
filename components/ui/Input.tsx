import { Eye, EyeOff } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';
import { Text } from './Base';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    style?: StyleProp<ViewStyle>;
}

export const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
    keyboardType = 'default',
    style,
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text variant="sm" color="textSecondary" style={styles.label}>
                    {label}
                </Text>
            )}
            <View style={[styles.inputContainer, error ? styles.errorBorder : null]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    style={styles.input}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                        {showPassword ? (
                            <EyeOff size={20} {...({ color: theme.colors.textSecondary } as any)} />
                        ) : (
                            <Eye size={20} {...({ color: theme.colors.textSecondary } as any)} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text variant="xs" color="error" style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: theme.spacing.md,
    },
    label: {
        marginBottom: theme.spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        height: 50,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.sizes.md,
    },
    icon: {
        marginLeft: theme.spacing.sm,
    },
    errorBorder: {
        borderColor: theme.colors.error,
    },
    errorText: {
        marginTop: theme.spacing.xs,
    },
});
