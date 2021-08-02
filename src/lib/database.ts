import { JSONFile, Low } from 'lowdb';
import path, { join } from 'path';
import {URL} from 'url'
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import pswdItem from '../db/pswd_Item';
export default class Database {
  pswdMap = new Map<number, pswdItem>();

  constructor(public title: string, public pswdItem: pswdItem[] = []) {
    pswdItem.forEach(pswd => this.pswdMap.set(pswd.ID, pswd));
  }
}

