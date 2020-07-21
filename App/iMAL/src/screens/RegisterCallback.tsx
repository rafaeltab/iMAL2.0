import { View, Text, Dimensions } from 'react-native';
import * as Linking from 'expo-linking';
import React from 'react';
import { NavigationDrawerScreenProps } from 'react-navigation-drawer';
import Auth from '../APIManager/Authenticate';

function App(props: NavigationDrawerScreenProps) {
    let str = (props?.navigation?.state?.params?.uuid as string);
    try {
        Auth.getInstance().then((auth) => {
            auth.setCode(str);
            props.navigation.navigate("Main");
        });
    } catch (e) {
        console.log(e);
    }
    return (
        <View style={{justifyContent:'center',alignItems:'center', height: Dimensions.get('window').height}}>
            <Text>{str}</Text>
        </View>        
    );
}

export default App;