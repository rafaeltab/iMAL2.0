import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, NavigationRouteConfigMap, NavigationRoute, NavigationParams, CreateNavigatorConfig, NavigationStackRouterConfig } from 'react-navigation';
import Main from '../main';
import { StackNavigationOptions, StackNavigationProp, StackNavigationConfig } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import AnimeDetails from '../screens/AnimeDetails';

const screens : NavigationRouteConfigMap<StackNavigationOptions,StackNavigationProp<NavigationRoute<NavigationParams>>,unknown>  = {
    Main: {
        screen: Main
    },
    Details: {
        screen: AnimeDetails
    }
}

const defaultOptions: CreateNavigatorConfig<StackNavigationConfig, NavigationStackRouterConfig, StackNavigationOptions, StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>> | undefined = {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#2E51A2'            
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        title: "iMAL"
        
    },
    headerMode: "screen"
}

const MainStack = createStackNavigator(screens, defaultOptions);
export default createAppContainer(MainStack);