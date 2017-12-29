import { Component } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';

@Component({
  selector: 'aa-login',
  templateUrl: './login.component.html',
  styleUrls: ['/login.component.scss']
})
export class LoginComponent {
  constructor(private firebase: Firebase) {

  }
}
