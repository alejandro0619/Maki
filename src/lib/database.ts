import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { pswdCollection, pswdSchema } from '../db/pswd_Item';
import Password from './password.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const password = new Password();

export class DbService {
  private adapter = new JSONFile<pswdCollection>(join(__dirname, '../db/db.json'));
  private db = new Low<pswdCollection>(this.adapter);
  
  private async setupDB(): Promise<pswdCollection> {
    await this.db.read();
    return this.db.data ||= { schema: [] }

  }
  async addPassword(pswd: pswdSchema, psphrase: string) {
    const data = await this.setupDB();
    const { schema } = data;
    const pswdEncrypted: pswdSchema = {
      title: pswd.title,
      pswd: password.encrypt(pswd.title, psphrase)
    }
    schema.push(pswdEncrypted);
    await this.db.write();
  }
  async getPasswordByTitle(title: string): Promise<pswdSchema | undefined> {
    const data = await this.setupDB();
    const { schema } = data;
    return schema.find(p => p.title === title);
  }
  async getAllPassword() {
    const data = await this.setupDB();
    const { schema } = data;
    schema.forEach(p => console.log(p.title, p.pswd));
  }
  async editPassword(title: string, newPswd: string) {
    const data = await this.setupDB();
    const { schema } = data;
    const index = schema.findIndex(p => p.title === title);
    schema[index]['pswd'] = newPswd;
    await this.db.write()
  }
  async deletePassword(title: string) {
    const data = await this.setupDB();
    const { schema } = data;
    const index = schema.findIndex(p => p.title === title);
    schema.splice(index, 1);
    await this.db.write();
  }
}
const example = new DbService();
await example.addPassword({ title: 'paypal4', pswd: '123456789' }, 'hello world');
console.log(await example.getPasswordByTitle('paypal4'))
