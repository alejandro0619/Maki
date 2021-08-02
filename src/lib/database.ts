import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import { pswdCollection } from '../db/pswd_Item';
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname)


export class DbService {
  private async setupDB() {

    const adapter = new JSONFile<pswdCollection>(join(__dirname, '../db/db.json'));
    const db = new Low<pswdCollection>(adapter);
    await db.read();
    db.data ||= { schema : [] }
    const { schema } = db.data;
    //schema.push({ title: 'ua', pswd: 'sssaaaaa' });
    //await db.write();
    }
}
const example = new DbService();
