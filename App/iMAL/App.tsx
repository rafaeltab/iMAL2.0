import App from './src/routes/Drawer';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { AppLoading } from 'expo';
import * as Linking from 'expo-linking';

const getFonts = () => Font.loadAsync({
    'AGRevueCyr' : require('./assets/fonts/AGRevueCyr.ttf')
});

const prefix = Linking.makeUrl("/");

export default () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    Linking.addEventListener('url', (e) => {
        console.log("yo");
    });

    if (fontsLoaded) {
        return (
            <App uriPrefix={prefix}/>
        );
    } else {
        return (
            <AppLoading
                startAsync={getFonts}
                onFinish={() => { setFontsLoaded(true); }}
            />
        );
    }
    
};