import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { IUser, IUserManipulation } from '../../helper/user/interface';
import { Task } from '../tasks/service';
import { Token } from '../token/service';
import { repo } from './repository';

export class User implements IUser {
  public readonly username: string;
  public readonly email: string;
  public readonly password: string;
  public readonly confirmed: boolean = false;
  public readonly created: number = Date.now();

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = bcrypt.hashSync(password, 7);
  }

  public async save(): Promise<void> {
    try {
      const idUser: ObjectId = await repo.createUser(this);
      await new Token(idUser).createConf();
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async confirm(
    idUser?: ObjectId | string,
    confToken?: string
  ): Promise<void> {
    try {
      if (confToken) {
        const { _id }: { _id?: ObjectId } = await Token.getByConf(confToken);
        if (_id) {
          await repo.editUser({ confirmed: true }, _id);
          await new Token(_id).delete();
        }
      } else if (idUser) {
        await repo.editUser(
          { confirmed: true },
          typeof idUser === 'string' ? new ObjectId(idUser) : idUser
        );
        await new Token(idUser).delete();
      } else {
        throw new Error('No data provided');
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async editUser(
    data: IUserManipulation,
    idUser: ObjectId | string
  ): Promise<void> {
    try {
      await repo.editUser(
        data,
        typeof idUser === 'string' ? new ObjectId(idUser) : idUser
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async changePassword(
    rawPassword: string,
    resetToken: string
  ): Promise<void> {
    try {
      const { _id }: { _id?: ObjectId } = await Token.getByReset(resetToken);
      if (_id) {
        await repo.editUser(
          { password: await bcrypt.hashSync(rawPassword, 7) },
          _id
        );
        await new Token(_id).delete();
      } else {
        throw new Error('This token does not exist');
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async deleteUses(idUser: ObjectId | string): Promise<void> {
    try {
      await Task.deleteForUser(idUser);
      await repo.deleteUser(
        typeof idUser === 'string' ? new ObjectId(idUser) : idUser
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async getUser(
    idUser?: ObjectId | string,
    email?: string
  ): Promise<IUser | null> {
    try {
      if (idUser) {
        return await repo.getUser(
          typeof idUser === 'string' ? new ObjectId(idUser) : idUser
        );
      } else if (email) {
        return await repo.getUserByEmail(email);
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
