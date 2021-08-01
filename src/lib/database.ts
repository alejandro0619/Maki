import { JSONFile, Low } from 'lowdb';
import path, { join } from 'path';
import {URL} from 'url'
const __dirname = path.dirname(new URL(import.meta.url).pathname);
export default class Database {
  
  private async createDatabase() {

  }
  saveInDatabase() {
  this.createDatabase()
    
  }
}

const aa = new Database();
aa.saveInDatabase()