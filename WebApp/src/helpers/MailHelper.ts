import * as sgMail from '@sendgrid/mail';
//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

export function Setup(){
    if(process.env.SENDGRID_API_KEY){
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        return;
    }    
    console.log("api key not set\n: " + JSON.stringify(process.env));
}