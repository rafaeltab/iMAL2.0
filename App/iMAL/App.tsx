import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hey</Text>
      <Text>Hey</Text>
      <Text>Hey</Text>
      <Text>Hey</Text>
      <Text>Hey</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    position: "absolute",
    top: 0,
    height: "10vh",
    width: "100vw"
  }
});
