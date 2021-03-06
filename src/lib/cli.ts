// imports

import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import chalk from 'chalk';
import { Choices } from '../utils/Menu_choices.js';
import Password from './password.js';
import DbService from './database.js';
import { parseToNumber } from '../utils/parse_to_number.js';
import { pswdSchema } from '../db/pswd_Item.js';
import Hash from '../helper/hash_passphrase.js';
import GetPassPhrase from '../helper/read_file.js';
import Check from '../helper/check_first_time.js';

// initializing

const passphrase: GetPassPhrase = new GetPassPhrase();
const password: Password = new Password();
const check: Check = new Check();
const hash: Hash = new Hash();

export default class CLIInterface { // * This is where I'll create my UI using inquirer.
  
  private async setUserPassphrase(): Promise<boolean> {
    // set user passphrase when he execute the application for the first time
    const userState: boolean = await check.check();
    if (userState) {
      const secret: string = await this.secret();
      const hashed: string = hash.hashPassPhrase(secret);
      await passphrase.write(hashed);
      return true;

    } else {
      const psp: string = await passphrase.read();
      const secret: string = await this.secret();

      if (hash.compare(psp, secret)) {

        return true;
      } else {
        return false;
      }
      
    }
  }

  private async secret(): Promise<string> {
    const secret: { secret: string } = await inquirer.prompt({
      message: 'Enter your security phrase',
      name: 'secret',
      type: 'password',
    });
    return hash.hashPassPhrase(secret['secret']);
    
  }

  // sets the field db after the assignment of secretpsp
  private db: DbService = new DbService(passphrase.read());

  /*
  This is the first view that will be "rendered" 
  */
  public async MenuView(): Promise<void> { // execute this function to se the user passphrase

    const userIsAuth: boolean = await this.setUserPassphrase();
    if (!userIsAuth) {
      console.log('Please enter the correct passphrase to access to your passwords.');
      await this.MenuView();
    } else {
      console.clear();
      const menu: { OptionSelected: Choices } = await inquirer.prompt({
        message: 'What do you want to do? ',
        type: 'list',
        name: 'OptionSelected',
        choices: Object.values(Choices)
      });
       
       switch (menu['OptionSelected']) {
         case Choices.generate:
           await this.generateView(); //generate random passwords
           break;
         case Choices.create:
           await this.createPassword();
           break;
         
         case Choices.edit:
           await this.editPasswords(); // edit password
           break;
         
         case Choices.view:
            this.getAllPasswordView(); // get all passwords
           break;
         
         case Choices.search: 
           await this.getSinglePasswordView(); // get password by title
           break;
         
         case Choices.delete:
           await this.deletePassword();
           break;
       }
    }
  }
  private async deletePassword(): Promise<void> {
    const deletePassword = await inquirer.prompt({
      message: 'Enter the title of the password you want to delete:',
      name: 'password',
      type: 'input',
    });
    await this.db.deletePassword(deletePassword['password']);
    console.log(`${chalk`{green successfully deleted}`}`);
  }
  private async createPassword(): Promise<void> {
    const createdPassword = await inquirer.prompt({
      message: 'Enter the password:',
      name: 'password',
      type: 'input',
    });
    const password: pswdSchema = await this.parseToSave(createdPassword['password']);
    await this.db.addPassword(password);
    console.log(`${chalk`{green successfully saved!}`}`);
  }

  private async editPasswords(): Promise<void> {
    const titleOfThePassword = await inquirer.prompt({
      message: 'Title',
      name: 'title',
      type: 'input',
    });
    
    const newPassword: { password: string } = await inquirer.prompt({
      message: 'New password:',
      name: 'password',
      type: 'password',
    });
    await this.db.editPassword(titleOfThePassword['title'], newPassword['password']); // passing the title and new password to search and edit in db
  }

  private async confirmToSave(): Promise<boolean> {
    const confirm: {confirmation: boolean} = await inquirer.prompt({
      message: 'Do you want to save it?',
      name: 'confirmation',
      type: 'confirm',
    });

    switch (confirm['confirmation']) {
      case true:
        return true;
      case false:
        return false;
      default:
        return false;
    }
  }

  private async save(pswd: pswdSchema, confirmation: boolean): Promise<void> {
    if (confirmation) {
      this.db.addPassword(pswd)
    }
  }

  private async parseToSave(pswd: string): Promise<pswdSchema> {
    const titleOfThePassword = await inquirer.prompt({
      message: 'Title',
      name: 'title',
      type: 'input',
    });
    return {
      title: titleOfThePassword['title'],
      pswd: pswd
    }
  }

/*
 * All CLI views right bellow

  ? (btw I think I should stop implementing a lot of methods in this file to avoid complexity (more than the autogenerated by my spaghetti code))
  !TODO: refactor a bit '-'
 */
  private async getAllPasswordView(): Promise<void> {

    console.log(await this.db.getAllPassword());
  }

  private async getSinglePasswordView(): Promise<void> {
    const title = await inquirer.prompt({
      message: 'Tile',
      name: 'password',
      type: 'input',
    });

    console.log(await this.db.getPasswordByTitle(title['password']));
  }

  private async generateView(): Promise<void> {
    const generateOptions = await inquirer.prompt({
      message: 'How much long you want your password to be?',
      name: 'length',
      type: 'input',
    });

    const pswdLength: number = parseToNumber(generateOptions['length']);
    if (isNaN(pswdLength)) {
      console.log(`Please enter a number.`);
      return this.generateView();
    } else {

      const pswdGenerated: string = password.generatePassword(pswdLength);
      await clipboardy.write(pswdGenerated);
      console.log(`Your password: ${chalk`{green ${pswdGenerated} }`} is copied on the clipboard!`);
      const confirmation: boolean = await this.confirmToSave();
      const parsed: pswdSchema  = await this.parseToSave(pswdGenerated);
      await this.save(parsed, confirmation);
      console.log(`${chalk`{green successfully saved!}`}`);
    }
  }
}
const aa = new CLIInterface();

const response = await aa.MenuView()