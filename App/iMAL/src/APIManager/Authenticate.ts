import { AsyncStorage } from 'react-native';
import { isUUID } from './helper/FormatChecker';

class Authentication {
    private static instance: Authentication;
    private stateCode?: string = "12ac8766-cc54-4360-b7c4-91cd1374daec";

    private constructor() {
        console.log("Starting Authenticator...");
        if(this.stateCode) {
            return;
        }
        
        //try to load stateCode from local storage
        AsyncStorage.getItem("stateCode")
            .then((value) => {
                if (value != null && isUUID(value)) {
                    //value was in localstorage so put it in the variable
                    this.stateCode = value;
                } else {
                    //value was not in localstorage so get it from the server
                    this.StartAuthentication()
                }
        });
    }

    private async StartAuthentication() {
        //start authentication by asking the server for a link
    }

    public GetStateCode(): string | undefined {
        return this.stateCode;
    }

    static getInstance(): Authentication {
        if (!Authentication.instance) {
            Authentication.instance = new Authentication();
        }

        return Authentication.instance;
    }
}

export default Authentication;