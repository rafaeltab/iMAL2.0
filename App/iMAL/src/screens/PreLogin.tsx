import React from 'react';
import { Text, View } from 'react-native';
import {Dimensions } from "react-native";
import Auth from '../APIManager/Authenticate';
import { NavigationSwitchScreenProps } from 'react-navigation';

Auth.devMode = false;
Auth.ClearAsync();

class PreLogin extends React.Component<NavigationSwitchScreenProps,NavigationSwitchScreenProps> {
    constructor(props: NavigationSwitchScreenProps) {
        super(props);
        this.state = {
            navigation: props.navigation,
            theme: props.theme,
            screenProps: props.screenProps
        };

        
        Auth.getInstance().then((auth) => {
            if (auth.getLoaded()) {
                this.state.navigation.navigate("Main");
            } else {
                this.state.navigation.navigate("Login");
            }
        });
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