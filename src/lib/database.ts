import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { pswdCollection } from '../db/pswd_Item';
const __dirname = dirname(fileURLToPath(import.meta.url));

export class DbService {
  private adapter = new JSONFile<pswdCollection>(join(__dirname, '../db/db.json'));
  private db = new Low<pswdCollection>(this.adapter);
  
  private async setupDB() {
    await this.db.read();
    this.db.data ||= { schema : [{title: '', pswd: ' '}] }
    const { schema } = this.db.data;
    //schema.push({ title: 'ua', pswd: 'sssaaaaa' });
    //await db.write();
  }
  addPassword() {
    
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
    this.setupDB()
  }
}
const example = new DbService();
example.start()
