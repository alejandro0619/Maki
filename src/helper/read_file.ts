import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default class GetPassPhrase {
  private filePath: string = join(__dirname, '../db/psp.txt');

  public async read(): Promise<string> {
    return await readFile(this.filePath, { encoding: 'utf8' });
  }

  public async write(passhraseHashed: string): Promise<void> {
    return await writeFile(this.filePath, passhraseHashed);
  }
}
