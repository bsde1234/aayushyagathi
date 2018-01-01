import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';

@Component({
  selector: 'aa-login',
  templateUrl: './login.component.html',
  styleUrls: ['/login.component.scss']
})
export class LoginComponent {
  constructor(private afAuth: AngularFireAuth) {
  }
  login() {
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    this.afAuth.auth.getRedirectResult().then((result) => {
      console.log(result)
    }).catch(err => {
      console.log(err);
    })
  }
}
