import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { ApiProtector } from './middleware';

import { ApiRouter } from './routes';

import dotenv from 'dotenv';
dotenv.config();

class App {
  public main: Application;
  public readonly mongoUri: string = `mongodb://admin:b12Xz00s@178.62.117.18:27017/minter_db`;
  public router: ApiRouter = new ApiRouter();

  constructor () {
    this.main = express();
    this.config();
    this.mongoSetup();
    this.router.routes(this.main);
  }

  private config = () => {
    this.main.use(cors());
    this.main.use(bodyParser.json());
    this.main.use(bodyParser.urlencoded({ extended: false }));
    this.main.use(ApiProtector);
  }

  private mongoSetup = () => {
    mongoose.connect(this.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }).then(() => {
      console.log('api database setup');
    }).catch((err) => {
      console.log(err.message);
    });
  }
}

export default App;