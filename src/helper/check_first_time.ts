import { Low, JSONFile } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import State from '../db/user_state.js'
const __dirname: string = dirname(fileURLToPath(import.meta.url));

export default class Check {
  private filePath: string = join(__dirname, '../db/userstate.json');
  private adapter: JSONFile<State> = new JSONFile<State>(this.filePath);
  private db: Low<State> = new Low<State>(this.adapter);

  private async setupDB(): Promise<State> {
    await this.db.read();
    return this.db.data ||= { state: true }

  }
  private async read(): Promise<{
    state: boolean,
    data: State
  }> {
    const data: State = await this.setupDB();
    return {
      state: data['state'],
      data: data
    };

  }
  public async check(): Promise<boolean> {
    let {state, data } = await this.read() 
    if (state === true) {
      data['state'] = !data['state']; // sets true to false;
      await this.db.write();
      return true; // is a new user
    }
    return false; // is not a new user
  }
}
