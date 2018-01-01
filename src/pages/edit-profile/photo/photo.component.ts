import { Component } from '@angular/core'
import { AlertController, NavController } from 'ionic-angular'
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { HomePage } from '../../home/home';

@Component({
  selector: 'page-photo',
  templateUrl: './photo.component.html'
})
export class PhotoComponent {
  constructor(private navCtrl: NavController,
    private camera: Camera) {

  }
  save() {
    if (this.navCtrl.parent.parent.canGoBack()) {
      this.navCtrl.parent.parent.pop()
    } else {
      this.navCtrl.parent.parent.setRoot(HomePage)
    }
  }
  uploadImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options)
      .then((data) => {
        console.log(data)
      })

  }
}
