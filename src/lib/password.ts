import CryptoJS from "crypto-js";
import crypto from 'node:crypto';
const { AES, enc} = CryptoJS;
export default class Password {
  public generatePassword(length: number): string {

    const wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';

    return Array.
      from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => wishlist[x % wishlist.length])
      .join('');
  }
  
  public encrypt(pswd: string, psphrase: string): string { // pswd stands for password and psphrase for passphrase 
    return AES.encrypt(pswd, psphrase).toString();
  }
  public decrypt(pswdEncrypted: string, psphrase: string): string { //decrypt and decode
    return AES.decrypt(pswdEncrypted, psphrase).toString(enc.Utf8);
  }
}
