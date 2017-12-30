import { Component } from '@angular/core'
import { AlertController, NavController } from 'ionic-angular'

import { HomePage } from '../../home/home';

@Component({
  selector: 'page-photo',
  templateUrl: './photo.component.html'
})
export class PhotoComponent {
  constructor(private navCtrl: NavController) {

  }
  save() {
    if (this.navCtrl.parent.parent.canGoBack()) {
      this.navCtrl.parent.parent.pop()
    } else {
      this.navCtrl.parent.parent.setRoot(HomePage)
    }
  }
}
