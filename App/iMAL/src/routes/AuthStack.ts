/*
All authentication screen stuff goes here
*/
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, NavigationRouteConfigMap, NavigationRoute, NavigationParams, CreateNavigatorConfig, NavigationStackRouterConfig } from 'react-navigation';
import { StackNavigationOptions, StackNavigationProp, StackNavigationConfig } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import Register from '../screens/Register';
import Login from '../screens/Login';

const screens : NavigationRouteConfigMap<StackNavigationOptions,StackNavigationProp<NavigationRoute<NavigationParams>>,unknown>  = {
    Login: {
        screen: Login
    },
    Register: {
        screen: Register
    }
}

const defaultOptions: CreateNavigatorConfig<StackNavigationConfig, NavigationStackRouterConfig, StackNavigationOptions, StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>> | undefined = {
    headerMode: "none"
}

const AuthStack = createStackNavigator(screens, defaultOptions);
export default AuthStack;