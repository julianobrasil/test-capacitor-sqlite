import {Injectable, OnInit} from '@angular/core';

import {Plugins} from '@capacitor/core';
import * as PluginsLibrary from '@jeepq/capacitor';
const {CapacitorSqlite, Device} = Plugins;

@Injectable({providedIn: 'root'})
export class SqliteService implements OnInit {
  _sqlite: any;

  ngOnInit() {
  }

  async initializePlugin() {
    console.log('####################################');
    console.log('# About to get a reference for CapacitorSqlite');
    console.log('####################################');
    const info = await Device.getInfo();
    if (info.platform === 'ios' || info.platform === 'android') {
      this._sqlite = CapacitorSqlite;
    } else {
      this._sqlite = PluginsLibrary.CapacitorSQLite;
    }

    console.log('####################################');
    console.log('# I have a reference for CapacitorSqlite');
    console.log('####################################');
  }

  async testSQLitePlugin() {
    console.log('####################################');
    console.log('# About to open a connection to testsqlite database');
    console.log('####################################');
    const result: any = await this._sqlite.open({database: 'testsqlite'});
    console.log('####################################');
    console.log('# Open method executed');
    console.log('####################################');
    const retOpenDB: any = result.result;
    if (retOpenDB) {
      console.log('####################################');
      console.log('# About to to start database operation testing');
      console.log('####################################');
      // Create Tables if not exist
      let sqlcmd = `
           BEGIN TRANSACTION;
           CREATE TABLE IF NOT EXISTS users (
               id INTEGER PRIMARY KEY NOT NULL,
               email TEXT UNIQUE NOT NULL,
               name TEXT,
               age INTEGER
           );
           PRAGMA user_version = 1;
           COMMIT TRANSACTION;
           `;
      let retExe: any = await this._sqlite.execute({statements: sqlcmd});
      console.log('retExe ', retExe.changes);
      // Insert some Users
      sqlcmd = `
           BEGIN TRANSACTION;
           DELETE FROM users;
           INSERT INTO users (name,email,age) VALUES ("Whiteley","Whiteley.com",30);
           INSERT INTO users (name,email,age) VALUES ("Jones","Jones.com",44);
           COMMIT TRANSACTION;
           `;
      retExe = await this._sqlite.execute({statements: sqlcmd});
      console.log('retExe ', retExe.changes);
      // Select all Users
      sqlcmd = 'SELECT * FROM users';
      let retSelect: any = await this._sqlite.query({
        statement: sqlcmd,
        values: [],
      });
      console.log('retSelect.values.length ', retSelect.values.length);
      const row1: any = retSelect.values[0];
      console.log('row1 users ', JSON.stringify(row1));
      const row2: any = retSelect.values[1];
      console.log('row2 users ', JSON.stringify(row2));

      // Insert a new User with SQL and Values

      sqlcmd = 'INSERT INTO users (name,email,age) VALUES (?,?,?)';
      const values: Array<any> = ['Simpson', 'Simpson@example.com', 69];
      const retRun: any = await this._sqlite.run({statement: sqlcmd, values});
      console.log('retRun ', retRun.changes);

      // Select Users with age > 35
      sqlcmd = 'SELECT name,email,age FROM users WHERE age > ?';
      retSelect = await this._sqlite.query({statement: sqlcmd, values: ['35']});
      console.log('retSelect ', retSelect.values.length);
      console.log('####################################');
      console.log('# Database operation tests successfully executed');
      console.log('####################################');
    }
  }
}
