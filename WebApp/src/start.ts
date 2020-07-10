import ExampleServer from './ExampleServer';

let PORT : number = 3000;
if (process.env.PORT) {
  PORT = parseInt(process.env.PORT);
}

const exampleServer = new ExampleServer();
exampleServer.start(3000);