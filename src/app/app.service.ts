import { Injectable } from '@angular/core'

import { AlertController, ToastController } from 'ionic-angular'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AppService {
  userDataDoc: AngularFirestoreDocument<any>;
  userData$: Observable<any>;

  myProfileDoc: AngularFirestoreDocument<any>;
  myProfile$: Subject<any> = new Subject<any>();

  constructor(private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth) {
    this.userDataDoc = this.afs.collection('users')
      .doc(this.afAuth.auth.currentUser.uid);
    this.userData$ = this.userDataDoc.valueChanges();

    this.myProfileDoc = this.afs.collection('profiles').doc(this.afAuth.auth.currentUser.uid);
    this.myProfileDoc.valueChanges().subscribe(profile => {
      this.myProfile$.next(profile);
    });
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
    this.toastCtrl.create({
      message,
      duration: 3000,
      dismissOnPageChange: false,
      position: 'bottom',
      showCloseButton: true
    })
  }
}
