import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { GooglePlus } from '@ionic-native/google-plus';
import * as firebase from 'firebase';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
@Component({
  selector: 'aa-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private afAuth: AngularFireAuth,
    private gPlus: GooglePlus,
    private alert: AlertController
  ) {
  }
  login() {
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      .then(val => {
        return this.afAuth.auth.getRedirectResult()
      })
      .catch(err => {
        this.alert.create({
          buttons: ['OK'],
          title: 'Error',
          message: 'Error in Login'
        }).present();
      })
  }
}
