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
    this.loadDocs()
  }

  loadDocs(refresher?) {
    const loading = this.loader.create({
      content: 'Loading data...',
      dismissOnPageChange: true,
      spinner: 'dots'
    });
    if (!refresher) {
      loading.present();
    }
    this.afs.collection('profiles', ref => {
      let docRef = ref
        .orderBy('_id')
        .where('isDisabled', '==', true)
      return docRef;
    }).valueChanges()
      .subscribe(docs => {
        this.profiles = docs;
        if (!refresher) {
          loading.dismiss();
        } else {
          refresher.complete();
        }
      });
  }
  showProfile(id) {
    const modal = this.modalCtrl.create(ProfileComponent, { profileId: id, isModerator: true })
    modal.present()
  }
}
