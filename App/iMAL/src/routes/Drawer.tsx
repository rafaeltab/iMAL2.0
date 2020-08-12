import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import React from 'react';

class Hidden extends React.Component {
    render() {
        return null;
    }
}

const RootDrawerNavigator = createDrawerNavigator({
    Main: {
        screen: MainStack
    }
});

export default createAppContainer(RootDrawerNavigator);