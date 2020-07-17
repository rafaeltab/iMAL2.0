import React from 'react';
import { StyleSheet, FlatList, View, Text, Image, TouchableOpacity } from 'react-native';

export type AnimePicture = {
    medium: string,
    large: string
}

export type AnimeNode = {
    node: {
        id: number,
        title: string,
        main_picture: AnimePicture
    }
}

type AnimeItemProps = {
    item: AnimeNode
}

type AnimeItemState = AnimeNode;

class AnimeItem extends React.Component<AnimeItemProps, AnimeItemState>{
    constructor(props: AnimeItemProps) {
        super(props);

        this.state = props.item;
    }

    render() {
        return (        
            <TouchableOpacity style={styles.animeContainer}>
                <Image style={styles.image} source={{ uri: this.state.node.main_picture.medium }} />
                <Text style={styles.title}>{this.state.node.title}</Text>
            </TouchableOpacity>               
        );
    }
}

const styles = StyleSheet.create({
    animeContainer: {
        height: 180,
        width:100,
        marginTop: 10,
        marginLeft: 10
    },
    title: {
        fontSize: 14,
        marginLeft: 5,
        color: "white"
    },
    image: {
        width: 100,
        height:150
    }
});
  
export default AnimeItem;