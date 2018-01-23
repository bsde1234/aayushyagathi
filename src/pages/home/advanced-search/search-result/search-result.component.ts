import { Component } from '@angular/core'
import { ModalController } from 'ionic-angular'

import { ProfileComponent } from '../../../profile/profile.component'
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'page-search-result',
  templateUrl: './search-result.component.html'
})
export class PendingUsersComponent {
  profiles
  constructor(
    private modalCtrl: ModalController,
    private afs: AngularFirestore) { }
  loading;

  ngOnInit() {
    this.loadDocs()
  }

  loadDocs(refresher?) {
    this.loading = true;
    this.afs.collection('profiles', ref => {
      let docRef = ref
        .orderBy('_id')
        .where('isDisabled', '==', true)
      return docRef;
    }).valueChanges()
      .subscribe(docs => {
        this.profiles = docs;
        if (refresher) {
          refresher.complete();
        }
        this.loading = false;
      });
  }

  showProfile(id) {
    const modal = this.modalCtrl.create(ProfileComponent, { profileId: id, isModerator: true })
    modal.present()
  }
}
