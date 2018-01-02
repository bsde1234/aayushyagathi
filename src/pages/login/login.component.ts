import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
@Component({
  selector: 'aa-login',
  templateUrl: './login.component.html',
  styleUrls: ['/login.component.scss']
})
export class LoginComponent {
  constructor(private afAuth: AngularFireAuth,
    private gPlus: GooglePlus) {
  }
  login() {
    this.gPlus.login({
      webClientId: '1046047256297-7sk9jks0i2t3qbfn9he5ecui7up2seks.apps.googleusercontent.com',
      offline: true
    })
      .then(res => {
        this.afAuth.auth.signInWithCredential(res.accessToken);
      }, (err) => {
        console.log(err)
      })
      .catch(err => {
        console.log(err);
      })
  }
}
