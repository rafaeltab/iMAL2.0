import React, { useState,  } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import AnimeItem, { AnimeNode } from './AnimeItem';
import { stringify } from 'querystring';
import Authentication from '../APIManager/Authenticate';
import AnimeNodeSource from '../APIManager/AnimeNodeSource';

type AnimeListState = {
    title: string,
    data: AnimeNode[],
    animeNodeSource: AnimeNodeSource
}

type AnimeListProps = {
    title: string,
    animeNodeSource: AnimeNodeSource
}

class AnimeList extends React.Component<AnimeListProps,AnimeListState> {
    constructor(props: AnimeListProps) {
        super(props);

        this.state = {
            title: props.title,
            data: [],
            animeNodeSource: props.animeNodeSource
        };
        
        this.state.animeNodeSource.MakeRequest().then((data) => {
            this.setState(old => {
                old.data.push(...data.data);
                return old;
            });                  
        });
    }

    render() {
        return (
            <View style={styles.animeContainer}>
                <Text style={styles.title}>{this.state.title}</Text>
                <FlatList
                    horizontal={true}
                    data={this.state.data}
                    renderItem={(item) => { return (<AnimeItem item={item.item} />) }}
                    keyExtractor={(item,index) => index.toString()}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    animeContainer: {
        height: 240,
        marginTop: 10
    },
    title: {
        fontSize: 20,
        marginLeft: 5,
        color: "white"
    },
    animeList: {
        justifyContent: 'flex-start'
    }
});

export default AnimeList;