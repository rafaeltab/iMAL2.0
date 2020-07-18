import { AsyncStorage } from 'react-native';
import { isUUID } from './helper/FormatChecker';

class Authentication {
    private static instance: Authentication;
    private stateCode?: string = "3ecc7d96-36b0-4160-a68f-0d4ddc70bdce";

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