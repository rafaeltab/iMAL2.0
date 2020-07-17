import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { AnimeNode } from '../components/AnimeItem';

//TODO everything
const App = ({ navigation } : NavigationStackScreenProps) => {   
    let screenProp = (navigation.getParam("item") as AnimeNode);
    return (
        <SafeAreaProvider style={styles.appContainer}> 
          <Text>{screenProp.node.title}</Text>
        </SafeAreaProvider>      
    );
};

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: "#1a1a1a"
    }
});
  
export default App;