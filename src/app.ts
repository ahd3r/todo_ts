import * as bodyParser from 'body-parser';
// import * as express from 'express';
import express = require('express');

import { routes as TaskRoutes } from './components/tasks/routes';

class Todo {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.acaoProtect();
    this.bodyParser();
    this.bindTaskRoutes();
    this.errorHandling();
  }

  private acaoProtect(): void {
    this.app.use(
      (
        req: express.Request,
        resp: express.Response,
        next: express.NextFunction
      ) => {
        resp.header('Access-Control-Allow-Origin', '*');
        resp.header('Access-Control-Allow-Methods', '*');
        resp.header('Access-Control-Allow-Headers', '*');
        next();
      }
    );
  }
  private bodyParser(): void {
    this.app.use('/', bodyParser.json());
  }
  private errorHandling(): void {
    this.app.use(
      '/',
      (
        req: express.Request,
        resp: express.Response,
        next: express.NextFunction
      ) => {
        resp.send({ err: 'Not found: 404' });
      }
    );
  }
  private bindTaskRoutes(): void {
    this.app.use('/task/', TaskRoutes);
  }
}

export const app: express.Express = new Todo().app;
