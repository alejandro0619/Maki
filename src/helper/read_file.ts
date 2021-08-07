import { writeFile } from 'fs/promises';
import { readFileSync } from 'fs'
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default class GetPassPhrase {
  private filePath: string = join(__dirname, '../db/psp.txt');

  public read(): string {
    return readFileSync(this.filePath, { encoding: 'utf8' });
  }

  public async write(passhraseHashed: string): Promise<void> {
    return await writeFile(this.filePath, passhraseHashed);
  }
}
