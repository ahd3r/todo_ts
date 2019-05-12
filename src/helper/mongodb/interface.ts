import { MongoClient } from 'mongodb';

export interface IMongoHelperInterface {
  client: Promise<MongoClient>;
}
