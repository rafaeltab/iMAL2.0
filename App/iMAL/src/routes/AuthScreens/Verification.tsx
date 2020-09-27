import React from "react";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { StyleSheet, Text, View, TextInput, Dimensions,  } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import CodeInput from 'react-native-code-input';

export default class Verif extends React.Component<NavigationStackScreenProps,{uuid:string}>{
    private styles = StyleSheet.create({
        appContainer: {
            backgroundColor: "#2e51a2",
            alignItems: 'center',
            justifyContent: 'center'
        },
        safeContainer: {
            backgroundColor: "#2e51a2"
        },
        VerifInput: {
            width: 240,
            height: 50,
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            color: 'white',
            fontSize: 50,
            letterSpacing: 10
        },
        content: {
            height: Dimensions.get('window').height,
            alignItems: 'center',
            justifyContent: 'center'
        },
        text: {
            color: 'white',
            fontSize: 15
        }
    });

    constructor(props: NavigationStackScreenProps){
        super(props);
        this.state = {
            uuid: (props.navigation.getParam("uuid") as string)
        };
    }

    private FullCode(text: number){
        
    }

    render(){
        return (
            <View style={this.styles.appContainer}>
                <SafeAreaView style={this.styles.safeContainer} />
                <View style={this.styles.content}>
                    <Text style={this.styles.text}>A verification code has been sent to your email</Text>
                    <Text style={this.styles.text}>enter it down below</Text>
                    <CodeInput
                        ref="codeInputRef1"
                        secureTextEntry
                        borderType={'underline'}
                        space={5}
                        size={30}
                        inputPosition='left'
                        onFulfill={(code:any) => this.FullCode(code)}
    />
                </View>                
            </View>
        );
    }
}