import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { pswdCollection, pswdSchema } from '../db/pswd_Item';
const __dirname = dirname(fileURLToPath(import.meta.url));

export class DbService {
  private adapter = new JSONFile<pswdCollection>(join(__dirname, '../db/db.json'));
  private db = new Low<pswdCollection>(this.adapter);
  
  private async setupDB(): Promise<pswdCollection> {
    await this.db.read();
    return this.db.data ||= { schema: [] }

  }
  async addPassword(password: pswdSchema) {
    const data = await this.setupDB();
    const { schema } = data;
    schema.push(password);
    this.db.write();
  }
  async getPasswordByTitle(title: string) {
    const data = await this.setupDB();
    const { schema } = data;
    const p = schema.find(p => p.title === title);
    console.log(p)
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
    this.db.write()
  }
  async deletePassword(title: string) {
    const data = await this.setupDB();
    const { schema } = data;
    const index = schema.findIndex(p => p.title === title);

  }
  async start() {
    
  }
}
const example = new DbService();
example.editPassword('test7', '1234');
