import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { pswdCollection, pswdSchema } from '../db/pswd_Item';
import Password from './password.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const password = new Password();
export default class DbService {

  private adapter = new JSONFile<pswdCollection>(join(__dirname, '../db/db.json'));
  private db = new Low<pswdCollection>(this.adapter);
  
  readonly psphrase: string
  constructor(psphrase: string) {
    this.psphrase = psphrase
  }

  private async setupDB(): Promise<pswdCollection> {
    await this.db.read();
    return this.db.data ||= { schema: [] }

  }
  async addPassword(pswd: pswdSchema) {

    const data = await this.setupDB();
    const { schema } = data;
    const pswdEncrypted: pswdSchema = {
      title: pswd.title,
      pswd: password.encrypt(pswd.pswd, this.psphrase),
    }
    schema.push(pswdEncrypted);
    await this.db.write();

  }

  async getPasswordByTitle(title: string) {

    const data = await this.setupDB();
    const { schema } = data;
    const pswd: pswdSchema = <pswdSchema>schema.find(p => p.title === title);
    return password.decrypt(pswd.pswd, this.psphrase);

  }

  async getAllPassword(): Promise<pswdSchema[]> {
    const data = await this.setupDB();
    const { schema } = data;
    let pswd: pswdSchema[] = [];
    for (let i = 0; i < schema.length; i++){
      pswd.push({
        title: schema[i].title,
        pswd: password.decrypt(schema[i].pswd, this.psphrase)
      });
    }
    return pswd;
  }

  async editPassword(title: string, newPswd: string) {
    const data = await this.setupDB();
    const { schema } = data;
    const index = schema.findIndex(p => p.title === title);
    schema[index]['pswd'] = password.encrypt(newPswd, this.psphrase);
    await this.db.write();
  }

  async deletePassword(title: string) {
    const data = await this.setupDB();
    const { schema } = data;
    const index = schema.findIndex(p => p.title === title);
    schema.splice(index, 1);
    await this.db.write();
  }

}
