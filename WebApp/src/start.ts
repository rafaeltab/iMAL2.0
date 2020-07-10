import ExampleServer from './ExampleServer';
import { Logger } from '@overnightjs/logger';

let PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

if (PORT === 3000) {
  Logger.Warn(`env port is ${process.env.PORT}`);
}

const exampleServer = new ExampleServer();
exampleServer.start(PORT);