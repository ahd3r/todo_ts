import { Collection, MongoClient, ObjectId } from 'mongodb';
import { db } from '../../helper/mongodb/db';
import { IUser, IUserManipulation } from '../../helper/user/interface';

class Repository {
  private readonly client: Promise<MongoClient>;
  private readonly collection: Promise<Collection>;

  constructor() {
    this.client = db;
    this.collection = this.getCollection();
  }

  private async getCollection(): Promise<Collection> {
    try {
      const client: MongoClient = await this.client;
      let collection: Collection;
      if (process.env.NODE_ENV === 'test') {
        collection = client.db('todo_test').collection('user');
      } else {
        collection = client.db('todo').collection('user');
      }
      return collection;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async createUser(data: IUser): Promise<ObjectId> {
    try {
      const collection: Collection = await this.collection;
      const {
        insertedId
      }: { insertedId: ObjectId } = await collection.insertOne(data);
      return insertedId;
    } catch (err) {
      throw new Error(err);
    }
  }
  public async editUser(
    data: IUserManipulation,
    idUser: ObjectId
  ): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.updateOne({ _id: idUser }, data);
    } catch (err) {
      throw new Error(err);
    }
  }
  public async deleteUser(idUser: ObjectId): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.deleteOne({ _id: idUser });
    } catch (err) {
      throw new Error(err);
    }
  }
  public async getUser(idUser: ObjectId): Promise<IUser | null> {
    try {
      const collection: Collection = await this.collection;
      return await collection.findOne({ _id: idUser });
    } catch (err) {
      throw new Error(err);
    }
  }
  public async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const collection: Collection = await this.collection;
      return await collection.findOne({ email });
    } catch (err) {
      throw new Error(err);
    }
  }
}

export const repo: Repository = new Repository();
