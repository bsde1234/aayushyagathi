import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';

import { HomePage } from '../../home/home';
import { AppService } from '../../../app/app.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@Component({
  selector: 'page-photo',
  templateUrl: './photo.component.html'
})
export class PhotoComponent {
  profile;
  noPhoto: string = 'assets/imgs/placeholder.png'
  constructor(private navCtrl: NavController,
    private camera: Camera,
    private appService: AppService,
    private loader: LoadingController,
    private toast: ToastController
  ) {
    this.appService.myProfileDoc.valueChanges()
      .subscribe(profile => {
        this.profile = profile;
      });
  }
  save() {
    if (this.navCtrl.parent.parent.canGoBack()) {
      this.navCtrl.parent.parent.pop()
    } else {
      this.navCtrl.parent.parent.setRoot(HomePage)
    }
  }
  uploadImage() {
    const loader = this.loader.create({
      content: 'Saving...',
      spinner: 'dots'
    });
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      allowEdit: true,
      targetHeight: 1024
    }
    loader.present();
    this.camera.getPicture(options)
      .then((data) => {
        const name = this.profile._id + '.png';
        const uploadTask = firebase.storage().ref('profile_photos')
          .child(name)
          .putString('data:image/jpeg;base64,' + data, 'data_url')
        uploadTask
          .on('state_changed', (snapshot: any) => {
            var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            loader.setContent(`${progress}% uploaded...`);
          }, (err) => {
            loader.dismiss();
            this.toast.create({
              message: 'Error while uploading image.',
              duration: 3000,
              showCloseButton: true
            }).present();
          }, () => {
            loader.dismiss();
            this.toast.create({
              message: 'Image uploaded',
              duration: 3000,
              showCloseButton: true
            }).present();
          });
      })
  }
}
