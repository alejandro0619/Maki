import CryptoJS, { lib } from "crypto-js";
import IPasswordParams from '../interfaces/password_params.js'
import Axios from 'axios';
const { AES, enc } = CryptoJS;

export default class Password {
  public async generatePassword(params: IPasswordParams) {
    const {
      capitalLetters,
      length,
      number } = params;
    const response = Axios.get('https://api.happi.dev/v1/generate-password')
  }
  public encrypt(pswd: string, psphrase: string): string { // pswd stands for password and psphrase for passphrase 
    return AES.encrypt(pswd, psphrase).toString();
  }

  public decrypt(pswdEncrypted: string, psphrase: string): string { //decrypt and decode
    return AES.decrypt(pswdEncrypted, psphrase).toString(enc.Utf8);
  }
}
