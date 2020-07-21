import { AsyncStorage, Alert } from 'react-native';
import { isUUID } from './helper/FormatChecker';

type JsonType = {
    status: "success" | "error",
    message: string
}

class Authentication {
    private static instance: Authentication;
    private stateCode?: string;// = "12ac8766-cc54-4360-b7c4-91cd1374daec";
    private loaded: boolean = false;

    private constructor() {
        console.log("Starting Authenticator...");
        if (this.stateCode) {
            this.loaded = true;
            return;
        }
        
        //try to load stateCode from local storage
        AsyncStorage.getItem("stateCode")
            .then((value) => {
                if (value != null && isUUID(value)) {
                    //value was in localstorage so put it in the variable
                    this.loaded = true;
                    this.stateCode = value;
                }
        });
    }

    private SetCode(uuid: string) {
        this.loaded = true;
        this.stateCode = uuid;
        AsyncStorage.setItem("stateCode", uuid);
    }

    public getLoaded(): boolean {
        return this.loaded;
    }

    public GetStateCode(): string | undefined {
        return this.stateCode;
    }

    /** make request to MAL, check status and save stateCode */
    public async Trylogin(email: string, password: string): Promise<boolean> {
        //url to make request to
        let url = `http://api.imal.ml/authed/login`;
        //the body of the request
        let body = {
            email: email,
            pass: password
        }
        //make the request
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        //is the response an error !?!?!?
        let json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened",json.message);
            return false;
        }

        //we good
        if (isUUID(json.message)) {
            this.SetCode(json.message);
            return true;
        }
        
        //oh no we not
        return false;
    }

    static getInstance(): Authentication {
        if (!Authentication.instance) {
            Authentication.instance = new Authentication();
        }

        return Authentication.instance;
    }
}

export default Authentication;