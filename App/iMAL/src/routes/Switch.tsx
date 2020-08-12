import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Drawer from './Drawer';
import Auth from './AuthStack';

export default createAppContainer(createSwitchNavigator({
    Auth: Auth,
    App: Drawer
},
{
    initialRouteName: 'Auth'
}));