import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import Header from './components/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimeList from './components/AnimeList';
import Authentication from './APIManager/Authenticate';
import SeasonalSource from './APIManager/Seasonal';

Authentication.getInstance();

const App = () => {
    const [items, setItems] = useState([
        {
            key: "Summer 2020:",
            nodeSource: new SeasonalSource(2020, "summer")
        },
        {
            key: "Summer 2019:",
            nodeSource: new SeasonalSource(2019, "summer")
        },
        {
            key: "Summer 2018:",
            nodeSource: new SeasonalSource(2018, "summer")
        },
        {
            key: "Summer 2017:",
            nodeSource: new SeasonalSource(2017, "summer")
        }
        ,
        {
            key: "Summer 2016:",
            nodeSource: new SeasonalSource(2016, "summer")
        }
        ,
        {
            key: "Summer 2015:",
            nodeSource: new SeasonalSource(2015, "summer")
        }
    ]);

    return (
        <SafeAreaProvider style={styles.appContainer}> 
            <Header title="iMAL" />
            <FlatList
                data={items}
                renderItem={(item) => (
                    <AnimeList title={item.item.key} animeNodeSource={item.item.nodeSource} />
                )} />
        </SafeAreaProvider>      
    );
};

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: "#1a1a1a"
    }
});
  
export default App;