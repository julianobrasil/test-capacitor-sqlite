import {Component, AfterViewInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SqliteService} from './sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _sqliteService: SqliteService
  ) {
    this.initializeApp();

    console.log({sqlite: this._sqliteService._sqlite});
  }

  ngAfterViewInit() {
    this._sqliteService
      .initializePlugin()
      .then(() => this._sqliteService.testSQLitePlugin().then());
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
