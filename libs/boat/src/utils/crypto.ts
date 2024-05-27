import bcrypt from 'bcrypt';

export class CryptoUtil {
  static saltRounds = 7;

  static async hash(data: string | Buffer): Promise<string> {
    return bcrypt.hash(data, CryptoUtil.saltRounds);
  }

  static async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
