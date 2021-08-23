// imports:

import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { pswdCollection, pswdSchema } from '../db/pswd_Item.js';
import Password from './password.js';

// initialize:

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const password: Password = new Password();
export default class DbService {

  private adapter: JSONFile<pswdCollection> = new JSONFile<pswdCollection>(join(__dirname, '../db/db.json'));
  private db: Low<pswdCollection> = new Low<pswdCollection>(this.adapter);
  
  readonly psphrase: string;
  /*
  reads the hashed text from the file psp.text and sets it as pass phrase.
  This passphrase will always be required in order to be able to make the CRUD operations within the database.
   */
  constructor(psphrase: string) {
    this.psphrase = psphrase;   
  }

  /*
  Sets the default schema for the database.
   */
  private async setupDB(): Promise<pswdCollection> {
    await this.db.read();
    return this.db.data ||= { schema: [] }

  }

  async addPassword(pswd: pswdSchema) { 

    const data: pswdCollection = await this.setupDB();
    const { schema } = data;
    const pswdEncrypted: pswdSchema = {
      title: pswd.title,
      pswd: password.encrypt(pswd.pswd, this.psphrase),
    }
    schema.push(pswdEncrypted);
    await this.db.write();

  }

  async getPasswordByTitle(title: string): Promise< string | undefined> {

    try {
      const data: pswdCollection = await this.setupDB();
      const { schema } = data;
      const pswd: pswdSchema = <pswdSchema>schema.find(p => p.title === title);
    return password.decrypt(pswd.pswd, this.psphrase);
    } catch (error) {
      console.log(error)
    }

  }

  async getAllPassword(): Promise<pswdSchema[] | undefined  > {
   try {
    const data: pswdCollection = await this.setupDB();
    const { schema } = data;
    let pswd: pswdSchema[] = [];
    for (let i = 0; i < schema.length; i++){
      pswd.push({
        title: schema[i].title,
        pswd: password.decrypt(schema[i].pswd, this.psphrase)
      });
    }
    return pswd;
   } catch (error) {
     console.error(error)
   }
  }

  async editPassword(title: string, newPswd: string) {
    const data: pswdCollection = await this.setupDB();
    const { schema } = data;
    const index = schema.findIndex(p => p.title === title);
    schema[index]['pswd'] = password.encrypt(newPswd, this.psphrase);
    await this.db.write();
  }

  async deletePassword(title: string) {
    const data: pswdCollection = await this.setupDB();
    const { schema } = data;
    const index = schema.findIndex(p => p.title === title);
    schema.splice(index, 1);
    await this.db.write();
  }

}
