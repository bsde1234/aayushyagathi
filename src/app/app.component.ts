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
import { AppService } from './app.service';

@Component({
  selector: 'page-app',
  templateUrl: './app.html'
})
export class MyApp {
  rootPage: any = LoginComponent;
  updateStatus;
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    afire: AngularFireAuth,
    private afs: AngularFirestore,
    codepush: CodePush,
    loading: LoadingController,
    fcm: FCM,
    appService: AppService) {
    const loader = loading.create({
      content: 'Signing in...',
      spinner: 'dots',
      dismissOnPageChange: true,
      enableBackdropDismiss: false
    });
    loader.present();
    platform.ready().then(() => {
      afire.authState.subscribe((user) => {
        if (user) {
          appService.loadInitData()
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
            });
          if (platform.is('cordova')) {
            splashScreen.hide();
            fcm.getToken().then(token => {
              this.saveFCMToken(user.uid, token);
            });
            fcm.onTokenRefresh().subscribe(token => {
              this.saveFCMToken(user.uid, token);
            });
          }
        } else {
          this.rootPage = LoginComponent;
          loader.dismiss();
        }
      })
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
        // codepush.sync({}, (status) => {
        //   appService.updateStatus$.next(status);
        //   this.updateStatus = status;
        // })
        //   .subscribe((syncStatus) => console.log(2, syncStatus));

        fcm.onNotification().subscribe(data => {
          console.log(data);
          if (data.wasTapped) {
          } else {

          }
        });
      }
    });
  }

  saveFCMToken(userId, FcmToken) {
    this.afs.collection('users').doc(userId).update({ FcmToken })
  }
}

