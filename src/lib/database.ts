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
  getPasswordByTitle() {
    
  }
  getAllPassword() {
    
  }
  editPassword() {
    
  }
  deletePassword() {
    
  }
  start() {
    this.addPassword({ 'title': 'test1', 'pswd': 'password 40000000' })
  }
}
const example = new DbService();
example.start()
