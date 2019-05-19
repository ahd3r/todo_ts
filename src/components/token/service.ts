import * as nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';
import { IUser } from '../../helper/user/interface';
import { repo } from './repository';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

export class Token {
  private readonly idUser: ObjectId;

  constructor(idUser: string | ObjectId) {
    this.idUser = typeof idUser === 'string' ? new ObjectId(idUser) : idUser;
  }

  private createToken(): string {
    let token: string = '';
    const availableChar: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i: number = 0; i < 40; i++) {
      token += availableChar.charAt(
        Math.floor(Math.random() * availableChar.length)
      );
    }
    return token;
  }
  private async createUniqToken(): Promise<string> {
    let token: string = this.createToken();
    let done: boolean;
    do {
      if (
        (await repo.getByConfToken(token)) ||
        (await repo.getByResetToken(token))
      ) {
        done = false;
        token = this.createToken();
      } else {
        done = true;
      }
    } while (!done);
    return token;
  }
  private static async sendLetter(
    email: string,
    type: 'conf' | 'reset',
    htmlBody: string
  ): Promise<void> {
    try {
      const client: OAuth2Client = new google.auth.OAuth2(
        '604914055857-tkl4hi5fnasag5c2glqkdvdt393sg829.apps.googleusercontent.com',
        '30j8v8YVoI-6mvHze_e30q7N',
        'https://developers.google.com/oauthplayground'
      );
      client.setCredentials({
        refresh_token: '1/EFmSz-ZmhIC76Mgu07LUkDl9zvia9d5QYNqo04C1j3I'
      });
      const accessToken:
        | string
        | null
        | undefined = (await client.getAccessToken()).token;
      if (accessToken) {
        nodemailer
          .createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'ander11110@gmail.com',
              clientId:
                '345257951452-ulsj61803g6rnpmv7792hue9jqapkdg8.apps.googleusercontent.com',
              clientSecret: 'bCoHFy2BeTFdLvLLQwPyGC-e',
              refreshToken: '1/EFmSz-ZmhIC76Mgu07LUkDl9zvia9d5QYNqo04C1j3I',
              accessToken: accessToken
            }
          })
          .sendMail(
            {
              from: 'todo@support.com',
              to: email,
              subject: type === 'conf' ? 'Confirm email' : 'Reset password',
              html: htmlBody
            },
            (err: Error | null) => {
              if (err) {
                throw new Error(err.message);
              }
            }
          );
      } else {
        throw new Error('Access token is not assignable');
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  public async createConf(): Promise<void> {
    try {
      const user: IUser | null = await repo.getByUserId(this.idUser);
      if (user) {
        const token: string = await this.createUniqToken();
        await repo.createConfTokenForUser(this.idUser, token);
        await Token.sendLetter(
          user.email,
          'conf',
          `<p>For confirm your email you must to click on this link: http//some_domen.com/${token}</p>`
        );
      } else {
        throw new Error('This user does not exist');
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  public async createReset(): Promise<void> {
    try {
      const user: IUser | null = await repo.getByUserId(this.idUser);
      if (user) {
        if (user.token) {
          throw new Error('At first you must to confirm your email');
        }
        const token: string = await this.createUniqToken();
        await repo.createResetTokenForUser(this.idUser, token);
        await Token.sendLetter(
          user.email,
          'reset',
          `<p>For reset your password you must to click on this link: http//some_domen.com/${token}</p>`
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  public async updateConf(): Promise<void> {
    try {
      const user: IUser | null = await repo.getByUserId(this.idUser);
      if (user) {
        const token: string = await this.createUniqToken();
        await repo.updateConfToken(this.idUser, token);
        await Token.sendLetter(
          user.email,
          'conf',
          `<p>For confirm your email you must to click on this link: http//some_domen.com/${token}</p>`
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  public async updateReset(): Promise<void> {
    try {
      const user: IUser | null = await repo.getByUserId(this.idUser);
      if (user) {
        const token: string = await this.createUniqToken();
        await repo.updateResetToken(this.idUser, token);
        await Token.sendLetter(
          user.email,
          'reset',
          `<p>For reset your password you must to click on this link: http//some_domen.com/${token}</p>`
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  public async delete(): Promise<void> {
    try {
      await repo.deleteByUserId(this.idUser);
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async deleteConf(confToken: string): Promise<void> {
    try {
      await repo.deleteByConfToken(confToken);
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async deleteReset(resetToken: string): Promise<void> {
    try {
      await repo.deleteByResetToken(resetToken);
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async getByReset(confToken: string): Promise<IUser> {
    try {
      const user: IUser | null = await repo.getByConfToken(confToken);
      if (user) {
        return user;
      } else {
        throw new Error('This token does not exist');
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async getByConf(resetToken: string): Promise<IUser> {
    try {
      const user: IUser | null = await repo.getByResetToken(resetToken);
      if (user) {
        return user;
      } else {
        throw new Error('This token does not exist');
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
