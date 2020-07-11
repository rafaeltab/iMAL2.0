import ExampleServer from './ExampleServer';
import { Logger } from '@overnightjs/logger';
import { SaveDict, RestoreDict } from './controllers/AuthedController';


let PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

if (PORT === 3000) {
    Logger.Warn(`env port is ${process.env.PORT}`);
}

RestoreDict("10");

const exampleServer = new ExampleServer();
const httpServe = exampleServer.start(PORT);

function GraceFullStop() {
    stopping = true;
    console.log("Gracefull stop");
    SaveDict("10");
    httpServe.close(() => {
        SaveDict("10");
        process.exit(0);
    });
    
}

let stopping = false;

process.on('exit', (code) => {
    if (!stopping) {
        GraceFullStop();
    }    
});

process.on('SIGTERM', (code) => {
    if (!stopping) {
        GraceFullStop();
    } 
});

process.on('SIGINT', (code) => {
    if (!stopping) {
        GraceFullStop();
    } 
});