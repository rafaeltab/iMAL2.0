import React from "react";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedbackBase, Linking } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Cursor from "react-native-confirmation-code-field/esm/Cursor";
import { CodeField } from "react-native-confirmation-code-field";
import Authentication from "../../APIManager/Authenticate";
import { Alert } from "react-native";

type State = {
    uuid: string,
    code: string,
    failed: boolean,
    attempt: number
}

export default class Verif extends React.Component<NavigationStackScreenProps, State>{
    constructor(props: NavigationStackScreenProps) {
        super(props);
        this.state = {
            uuid: (props.navigation.getParam("uuid") as string),
            code: "",
            failed: false,
            attempt: 0
        };
    }

    async Submit(code: string) : Promise<boolean>{
        let auth = await Authentication.getInstance();
        let uuid = auth.GetStateCode();
        if(uuid == undefined){
            Alert.alert("An error occured during the authentication process, please retry entering the verification code. If that doesn't work close and open the app.")
            return false;
        }
        let resp = await auth.TryVerif(uuid, code);
        if(resp.status == "error"){
            Alert.alert(resp.message)
            return false;
        }else{
            //open browser
            Linking.openURL(resp.message);
            return true;
        }
    }

    async SetCode(code: string) {
        if (code.match(/.*\D.*/)) return;

        this.setState({ ...this.state, code: code })

        if (code.length == 6) {
            if(!await this.Submit(code)){
                this.setState({ ...this.state, code: "", failed: true})
            }
        }else{
            console.log("hey: " + code.length.toString() + " " + this.state.failed)
        }
    }

    render() {
        const CELL_COUNT = 6;

        type renderCell = {
            index: any, symbol: any, isFocused: any
        }

        return (
            <View style={styles.appContainer}>
                <SafeAreaView style={styles.safeContainer} />
                <View style={styles.content}>
                <Text style={styles.head}>iMAL</Text>
                    <Text
                        style={styles.sentMailText}>
                        We've sent you an email with a verification code, please enter it below.</Text>
                    <Text style={[styles.hidden,this.state.failed && styles.incorrect]}>Incorrect Code</Text>
                    <CodeField
                        value={this.state.code}
                        onChangeText={this.SetCode.bind(this)}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={(data: renderCell) => (
                            <Text
                                key={data.index}
                                style={[styles.cell, data.isFocused && styles.focusCell]}>
                                {data.symbol || (data.isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        margin: 5,
        borderWidth: 2,
        borderColor: '#eb6100',
        textAlign: 'center',
        color: "#eb6100"
    },
    focusCell: {
        borderColor: '#9b5100',
    },
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
    },
    incorrect: {
        color: 'red',
        fontSize: 20,
        opacity: 100
    },
    hidden: {
        opacity: 0
    },
    sentMailText: {
        color: 'white',
        width: Dimensions.get('window').width * 0.8,
        fontSize: 14,
        fontFamily: "AGRevueCyr"
    },
    head: {
        color: 'white',
        fontSize: 60,
        fontFamily: 'AGRevueCyr',
        marginBottom: 100
    },
});