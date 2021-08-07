import CryptoJS from 'crypto-js';
const { SHA512, enc } = CryptoJS;

export default class Hash {
  public hashPassPhrase(psphrase: string): string {
    return SHA512(psphrase).toString();
  
  }
  public compare(psphrase: string, input: string): boolean {
    // input = psphrase to compare against the returned value from hashPassPhrase method
    return psphrase === this.hashPassPhrase(input) ? true : false;
  }
}
