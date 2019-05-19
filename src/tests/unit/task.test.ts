/* tslint:disable */

import { User } from '../../components/user/service';
import { db } from '../../helper/mongodb/db';
import { MongoClient } from 'mongodb';

describe('Need it', () => {
  beforeAll(async (done) => {
    const client: MongoClient = await db;
    // const collectionArr: string[] = (await client
    //   .db('todo_test')
    //   .listCollections()
    //   .toArray()).map((val) => {
    //   return val.name;
    // });
    // if (collectionArr.includes('user')) {
    //   await client.db('todo_test').dropCollection('user');
    // }
    // if (collectionArr.includes('task')) {
    //   await client.db('todo_test').dropCollection('task');
    // }
    await client.db('todo_test').dropDatabase();
    await client.db('todo_test').createCollection('task');
    await client.db('todo_test').createCollection('user');
    await client
      .db('todo_test')
      .collection('user')
      .createIndex({ email: 1 }, { unique: true, sparse: true });
    await client
      .db('todo_test')
      .collection('user')
      .createIndex({ 'token.confirm': 1 }, { unique: true, sparse: true });
    await client
      .db('todo_test')
      .collection('user')
      .createIndex({ 'token.reset': 1 }, { unique: true, sparse: true });
    done();
  });

  test('check emailing', async (done) => {
    await new User('ander', 'ander11110@gmail.com', '1111').save();
    expect(1 + 1).toBe(2);
    done();
  });
});
