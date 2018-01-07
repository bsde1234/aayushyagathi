import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { CodePush } from '@ionic-native/code-push';

import { HomePage } from '../pages/home/home';
import { LoginComponent } from '../pages/login/login.component'

@Component({
  selector: 'page-app',
  templateUrl: './app.html'
})
export class MyApp {
  rootPage: any = LoginComponent;
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    afire: AngularFireAuth,
    afs: AngularFirestore,
    codepush: CodePush) {
    if (afire.auth.currentUser) {
      this.rootPage = HomePage;
    }
    afire.authState.subscribe((user) => {
      if (user) {
        this.rootPage = HomePage;
        const profileDoc = afs.collection('profiles').doc(user.uid);

        profileDoc.valueChanges()
          .subscribe(profile => {
            if (!profile) {
              var usrName = (user.displayName || ' ').split(' ');
              profileDoc.set({ firstName: usrName[0], lastName: usrName[1] });
            }
          })
      }
      else
        this.rootPage = LoginComponent;
    })
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      codepush.sync().subscribe((syncStatus) => console.log(syncStatus));
    });
  }
}

