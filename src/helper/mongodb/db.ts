import * as mongo from 'mongodb';

import { IMongoHelperInterface } from './interface';

class MongoHelperConnect implements IMongoHelperInterface {
  public readonly client: Promise<mongo.MongoClient>;
  private readonly uri: string = 'localhost_or_cloud';

  constructor() {
    this.client = this.connect();
  }

  private async connect(): Promise<mongo.MongoClient> {
    try {
      return await new mongo.MongoClient(this.uri, {
        useNewUrlParser: true
      }).connect();
    } catch (err) {
      throw new Error(err);
    }
  }
}

export const db: Promise<mongo.MongoClient> = new MongoHelperConnect().client;
