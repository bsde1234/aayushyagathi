import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { CodePush } from '@ionic-native/code-push';
import { FCM } from '@ionic-native/fcm'
import { HomePage } from '../pages/home/home';
import { LoginComponent } from '../pages/login/login.component'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@Component({
  selector: 'page-app',
  templateUrl: './app.html'
})
export class MyApp {
  rootPage: any = HomePage;
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    afire: AngularFireAuth,
    afs: AngularFirestore,
    codepush: CodePush,
    loading: LoadingController,
    fcm: FCM) {
    const loader = loading.create();
    loader.present();
    afire.authState.subscribe((user) => {
      if (user) {
        this.rootPage = HomePage;
        const profileDoc = afs.collection('profiles').doc(user.uid);
        profileDoc
          .valueChanges()
          .subscribe(profile => {
            if (!profile) {
              var usrName = (user.displayName || ' ').split(' ');
              profileDoc.set({ firstName: usrName[0], lastName: usrName[1] }, { merge: true });
            }
            loader.dismiss();
          })
      }
      else
        this.rootPage = LoginComponent;
    })
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      codepush.sync({}, (status) => console.log(status))
        .subscribe((syncStatus) => console.log(syncStatus));
    });
    fcm.getToken().then(token => {
      console.log(token)
    });
    fcm.onTokenRefresh().subscribe(token => {
      console.log(token)
    });
    fcm.onNotification().subscribe(data => {
      console.log(data);
      if (data.wasTapped) {
      } else {

      }
    });
  }
}

