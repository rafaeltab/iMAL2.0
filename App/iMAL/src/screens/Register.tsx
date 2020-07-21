import React, { useState } from 'react';
import { StyleSheet, Text, Button, View, TextInput,  } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationDrawerScreenProps, NavigationDrawerProp } from 'react-navigation-drawer';
import {Dimensions } from "react-native";
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationRoute, NavigationParams } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';

type RegisterState = {
    navigator: NavigationDrawerProp<NavigationRoute<NavigationParams>, NavigationParams>,
    email: string,
    pass: string,
    retype: string
}

class Register extends React.Component<NavigationDrawerScreenProps, RegisterState>{
    constructor(props: NavigationDrawerScreenProps) {
        super(props);
        this.state = {
            navigator: props.navigation,
            email: "",
            pass: "",
            retype: ""
        }
    }

    private changeEmail(newstr: string) {
        this.setState({...this.state,email: newstr});
    }

    private changePass(newstr: string) {
        this.setState({...this.state,pass: newstr});
    }

    private changeRetype(newstr: string) {
        this.setState({...this.state,retype: newstr});
    }

    private DoSignup() {
        this.state.navigator.navigate("Home");
    }

    private DoSignin() {
        this.state.navigator.goBack();
    }

    render() {
        return (
            <View style={styles.appContainer}>
                <SafeAreaView style={styles.safeContainer} />
                <View style={styles.content}>
                    <Text style={styles.head}>Sign up</Text>
                    <TextInput onChangeText={this.changeEmail.bind(this)}
                        placeholder="Email"
                        autoCompleteType="email"
                        style={styles.Input}
                        value={this.state.email} />
                    <TextInput onChangeText={this.changePass.bind(this)}
                        placeholder="Password"
                        autoCompleteType="password"
                        secureTextEntry
                        style={styles.Input}
                        value={this.state.pass} />
                    <TextInput onChangeText={this.changeRetype.bind(this)}
                        placeholder="Retype Password"
                        autoCompleteType="password"
                        secureTextEntry
                        style={styles.Input}
                        value={this.state.retype} />
                    <TouchableOpacity
                        style={styles.SignupButton}
                        activeOpacity={0.6}
                        onPress={this.DoSignup.bind(this)}>
                        <Text style={styles.SignupButtonText}>Sign up</Text>
                    </TouchableOpacity>
                    <Text style={{color:'white'}}>
                        Have an account?
                    </Text>
                    <TouchableOpacity
                        style={styles.LoginButton}
                        activeOpacity={0.6}
                        onPress={this.DoSignin.bind(this)}>
                        <Text style={styles.LoginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: "#1a1a1a"
    },
    safeContainer: {
        backgroundColor: "#1a1a1a"
    },
    content: {
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center'
    },
    head: {
        color: 'white',
        fontSize: 60,
        fontFamily: 'AGRevueCyr'
    },
    Input: {
        width: 250,
        height: 50,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        color: 'white',
        fontSize: 20,
        marginTop:15
    },
    SignupButton: {
        borderRadius: 4,
        backgroundColor: '#2e51a2',
        paddingHorizontal: 97,
        paddingVertical: 10,
        marginTop: 40,
        marginBottom: 40,
        color: 'white'
    },
    SignupButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: "bold"
    },
    LoginButton: {
        borderRadius: 4,
        backgroundColor: '#2e51a2',
        paddingHorizontal: 60,
        paddingVertical: 6,
        marginTop: 5,
        color: 'white'
    },
    LoginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: "bold"
    }
});

/* not rouned
width: 250,
height: 50,
borderBottomColor: 'white',
borderBottomWidth: 1,
color: 'white',
fontSize: 20,
marginTop:20
*/
/* rounded:
width: 250,
height: 50,
borderColor: 'white',
borderWidth: 1,
borderRadius: 25,
paddingLeft: 20,
color: 'white',
fontSize: 20,
marginTop:10
*/

export default Register;