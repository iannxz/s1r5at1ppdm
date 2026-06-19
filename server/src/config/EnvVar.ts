import dotenv from 'dotenv';
import path from 'node:path';
import { EnvKey } from './enum/EnvKey';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export class EnvVar {
  private constructor() {};
  public static getString(chave: EnvKey): string {
  const valor = process.env[chave];
  if (!valor) {
    throw new Error(`A variável de ambiente ${chave} não está definida no .env.`);
  }
  return valor;
  }

  public static getNumber(chave: EnvKey): number {
  const valor = this.getString(chave);
  const valorConvertido = Number(valor);
  if (Number.isNaN(valorConvertido)) {
    throw new TypeError(`A variável de ambiente ${chave} não está definida no .env como número válido.`);
  }
    return valorConvertido;
  }

  public static getBoolean(chave: EnvKey): boolean {
    const valor = this.getString(chave).toLocaleLowerCase();
    return ['true', '1', 'yes', 'on'].includes(valor);
  }

  public static get SERVER_PORT(): number {
    return this.getNumber(EnvKey.SERVER_PORT);
  }
  public static get DB_HOST(): string {
    return this.getString(EnvKey.DB_HOST);
  }
  public static get DB_PORT(): number {
    return this.getNumber(EnvKey.DB_PORT);
  }
  public static get DB_USER(): string {
    return this.getString(EnvKey.DB_USER);
  }
  public static get DB_PASSWORD(): string {
    return this.getString(EnvKey.DB_PASSWORD);
  }
  public static get DB_NAME(): string {
    return this.getString(EnvKey.DB_NAME);
  }
  public static get JWT_SECRET(): string {
    return this.getString(EnvKey.JWT_SECRET);
  }
}
