import React from 'react';
import { Text, View } from 'react-native';
import {Dimensions } from "react-native";
import { NavigationDrawerScreenProps } from 'react-navigation-drawer';
import Auth from '../APIManager/Authenticate';

class PreLogin extends React.Component<NavigationDrawerScreenProps,NavigationDrawerScreenProps> {
    constructor(props: NavigationDrawerScreenProps) {
        super(props);
        this.state = props;
    }

    componentDidMount() {
        if (Auth.getInstance().getLoaded()) {
            this.state.navigation.navigate("Main");
        } else {
            this.state.navigation.navigate("Login");
        }   
    }

    render() {
        return (
            <View style={
                {
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: Dimensions.get('window').height
                }}>
                <Text>Loading</Text>
            </View>
        );
    }
}

export default PreLogin;