import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

const Header = (props: { title: string }) => {
    const insets = useSafeArea();

    return (
        <View style={
            {
                backgroundColor: '#2E51A2',
                height: 60 + insets.top,
                paddingTop: insets.top,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    );
}

//TODO use StatusBarHeight instead of 50
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'blue',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontSize: 30
    }
});

export default Header;