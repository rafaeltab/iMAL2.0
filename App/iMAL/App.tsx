import App from './src/routes/Drawer';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { AppLoading } from 'expo';

const getFonts = () => Font.loadAsync({
    'AGRevueCyr' : require('./assets/fonts/AGRevueCyr.ttf')
});

export default () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    if (fontsLoaded) {
        return (
            <App />
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