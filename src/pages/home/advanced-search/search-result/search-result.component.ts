import { Component } from '@angular/core'
import { ModalController } from 'ionic-angular'

import { ProfileComponent } from '../../../profile/profile.component'
import { AngularFirestore } from 'angularfire2/firestore';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
@Component({
  selector: 'page-search-result',
  templateUrl: './search-result.component.html'
})
export class PendingUsersComponent {
  profiles
  constructor(
    private modalCtrl: ModalController,
    private afs: AngularFirestore,
    private loader: LoadingController) { }

  ngOnInit() {
    const loading = this.loader.create({
      content: 'Loading data...',
      dismissOnPageChange: true,
      spinner: 'dots'
    })
    loading.present();
    this.afs.collection('profiles', ref => {
      let docRef = ref
        .orderBy('_id')
        .where('isDisabled', '==', true)
      return docRef;
    }).valueChanges()
      .subscribe(docs => {
        this.profiles = docs;
        loading.dismiss();
      });
  }

  showProfile(id) {
    const modal = this.modalCtrl.create(ProfileComponent, { profileId: id, isModerator: true })
    modal.present()
  }
}
