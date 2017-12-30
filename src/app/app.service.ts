import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { AlertController, ToastController } from 'ionic-angular'

@Injectable()
export class AppService {
  profile$
  favourites$
  myProfile$

  constructor(private alertCtrl: AlertController,
    private toastCtrl: ToastController) {

    // this.profile$ = new MongoObservable.Collection('profile')
    // this.favourites$ = new Mongo.Collection('favourite')
  }

  toggleShortlist(id, favourites) {
    // return MeteorObservable.call('toggleShortlist', id, favourites)
  }

  showError(err) {
    const errAlert = this.alertCtrl.create({
      buttons: ['Dismiss'],
      enableBackdropDismiss: true,
      title: err.Code,
      message: err.Message
    })
    errAlert.present()
  }

  showMessage(message) {
    const toast = this.toastCtrl.create({
      message,
      duration: 3000,
      dismissOnPageChange: false,
      position: 'bottom',
      showCloseButton: true
    })
  }
}
