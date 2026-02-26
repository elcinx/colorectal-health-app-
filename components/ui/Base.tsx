import * as React from 'react';
import { Text as RNText, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface TextProps {
    children: React.ReactNode;
    variant?: keyof typeof theme.typography.sizes;
    color?: keyof typeof theme.colors;
    style?: StyleProp<TextStyle>;
    weight?: '400' | '500' | '600' | '700';
    numberOfLines?: number;
}

export const Text = ({ children, variant = 'md', color = 'text', style, weight = '400', numberOfLines }: TextProps) => (
    <RNText
        numberOfLines={numberOfLines}
        style={[
            {
                fontSize: theme.typography.sizes[variant],
                color: theme.colors[color],
                fontFamily: theme.typography.fontFamily,
                fontWeight: (weight as any),
            },
            style,
        ]}
    >
        {children}
    </RNText>
);

interface BoxProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    padding?: keyof typeof theme.spacing;
    gap?: keyof typeof theme.spacing;
    flex?: number;
    direction?: 'row' | 'column';
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
}

export const Box = ({ children, style, padding, gap, flex, direction, align, justify }: BoxProps) => (
    <View
        style={[
            padding && { padding: theme.spacing[padding] },
            gap && { gap: theme.spacing[gap] },
            flex !== undefined && { flex },
            direction && { flexDirection: direction },
            align && { alignItems: align },
            justify && { justifyContent: justify },
            style,
        ]}
    >
        {children}
    </View>
);
