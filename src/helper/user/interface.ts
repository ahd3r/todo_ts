import { ObjectId } from 'mongodb';
import { IToken } from '../token/interface';

export interface IUser {
  readonly _id?: ObjectId;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly confirmed: boolean;
  readonly token?: IToken;
  readonly created: number;
}

export interface IUserManipulation {
  readonly username?: string;
  readonly password?: string;
  readonly confirmed?: boolean;
}
