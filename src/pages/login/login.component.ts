import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
@Component({
  selector: 'aa-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private afAuth: AngularFireAuth,
    private alert: AlertController,
    private loading: LoadingController
  ) {
  }
  login() {
    const loader = this.loading.create();
    loader.present();
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      .then(val => {
        loader.dismiss();
        return this.afAuth.auth.getRedirectResult();
      })
      .catch(err => {
        loader.dismiss();
        this.alert.create({
          buttons: ['OK'],
          title: 'Error',
          message: 'Error in Login'
        }).present();
      })
  }
}
