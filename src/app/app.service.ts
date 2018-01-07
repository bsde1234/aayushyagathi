import { Injectable } from '@angular/core'

import { AlertController, ToastController } from 'ionic-angular'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AppService {
  userDataDoc: AngularFirestoreDocument<any>;
  userData$: Observable<any>;

  myProfileDoc: AngularFirestoreDocument<any>;
  myProfile$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  updateStatus$: BehaviorSubject<any> = new BehaviorSubject<any>({ updateAvailable: false });

  constants$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth) {
    this.userDataDoc = this.afs.collection('users')
      .doc(this.afAuth.auth.currentUser.uid);
    this.userData$ = this.userDataDoc.valueChanges();

    this.myProfileDoc = this.afs.collection('profiles').doc(this.afAuth.auth.currentUser.uid);
    this.myProfileDoc.snapshotChanges()
      .map(doc => {
        return { _id: doc.payload.id, ...doc.payload.data() };
      })
      .subscribe(profile => {
        this.myProfile$.next(profile);
      });

    this.afs.collection('constants')
      .doc('3JaxBhC5W58pimwaJT0S')
      .valueChanges().subscribe(docs => {
        this.constants$.next(docs)
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
