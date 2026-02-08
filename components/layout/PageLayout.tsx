import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

interface PageLayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentStyle?: ViewStyle;
}

export function PageLayout({ children, style, contentStyle }: PageLayoutProps) {
    const paddingBottom = 0;

    return (
        <SafeAreaView style={[styles.safeArea, style]} edges={['top']}>
            <View style={[styles.container, { paddingBottom }, contentStyle]}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.light.supportBase },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 5, justifyContent: 'flex-start', backgroundColor: Colors.light.supportBase },
});

export default PageLayout;
