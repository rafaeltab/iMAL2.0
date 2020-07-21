/*
All authentication screen stuff goes here
*/
import { createStackNavigator } from 'react-navigation-stack';
import { NavigationRouteConfigMap, NavigationRoute, NavigationParams, CreateNavigatorConfig, NavigationStackRouterConfig } from 'react-navigation';
import { StackNavigationOptions, StackNavigationProp, StackNavigationConfig } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import Register from '../screens/Register';
import Login from '../screens/Login';
import PreLogin from '../screens/PreLogin';
import RegisterCallback from '../screens/RegisterCallback';

const screens : NavigationRouteConfigMap<StackNavigationOptions,StackNavigationProp<NavigationRoute<NavigationParams>>,unknown>  = {
    PreLogin: {
        screen: PreLogin
    },
    Login: {
        screen: Login
    },
    Register: {
        screen: Register
    },
    RegisterCallback: {
        screen: RegisterCallback,
        path: 'auth/:uuid'
    }
}

const defaultOptions: CreateNavigatorConfig<StackNavigationConfig, NavigationStackRouterConfig, StackNavigationOptions, StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>> | undefined = {
    headerMode: "none"
}

const AuthStack = createStackNavigator(screens, defaultOptions);
export default AuthStack;