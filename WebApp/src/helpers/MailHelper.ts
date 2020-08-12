import * as sgMail from '@sendgrid/mail';
//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

export function Setup(){
    if(process.env.SENDGRID_API_KEY){
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        return;
    }    
}

export function SendMail(){
    const msg = {
        to: 'rafael@rafaeltab.com',
        from: 'mail@imal.ml',
        subject: 'Test Email',
        text: 'test 1 2 3'
    }
    try{
        sgMail.send(msg);
    }catch(e){
        console.log(e);
    }
}