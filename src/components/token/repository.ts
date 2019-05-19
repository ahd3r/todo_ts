import { Collection, MongoClient, ObjectId } from 'mongodb';
import { db } from '../../helper/mongodb/db';
import { IUser } from '../../helper/user/interface';

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

  public async createConfTokenForUser(
    idUser: ObjectId,
    confToken: string
  ): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.updateOne(
        { _id: idUser },
        { $set: { token: { confirm: confToken } } }
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public async createResetTokenForUser(
    idUser: ObjectId,
    resetToken: string
  ): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.updateOne(
        { _id: idUser },
        { $set: { token: { reset: resetToken } } }
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public async updateConfToken(
    idUser: ObjectId,
    confToken: string
  ): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.updateOne(
        { _id: idUser },
        { $set: { token: { confirm: confToken } } }
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public async updateResetToken(
    idUser: ObjectId,
    resetToken: string
  ): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.updateOne(
        { _id: idUser },
        { $set: { token: { reset: resetToken } } }
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public async deleteByUserId(idUser: ObjectId): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.updateOne(
        { _id: idUser },
        { $unset: { resetToken: '', confirmToken: '' } }
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public async deleteByConfToken(confToken: string): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.updateOne(
        { token: { confirm: confToken } },
        { $unset: { confirmToken: '' } }
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public async deleteByResetToken(resetToken: string): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.updateOne(
        { token: { reset: resetToken } },
        { $unset: { resetToken: '' } }
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public async getByResetToken(resetToken: string): Promise<IUser | null> {
    try {
      const collection: Collection = await this.collection;
      return await collection.findOne({
        token: { reset: resetToken }
      });
    } catch (err) {
      throw new Error(err);
    }
  }
  public async getByConfToken(confToken: string): Promise<IUser | null> {
    try {
      const collection: Collection = await this.collection;
      return await collection.findOne({
        token: { confirm: confToken }
      });
    } catch (err) {
      throw new Error(err);
    }
  }
  public async getByUserId(idUser: ObjectId): Promise<IUser | null> {
    try {
      const collection: Collection = await this.collection;
      return await collection.findOne({ _id: idUser });
    } catch (err) {
      throw new Error(err);
    }
  }
}

export const repo: Repository = new Repository();
