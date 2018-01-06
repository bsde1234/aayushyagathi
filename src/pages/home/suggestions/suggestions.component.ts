import { Component } from '@angular/core'
import { ModalController } from 'ionic-angular'
import { AngularFirestore } from 'angularfire2/firestore';

import { ProfileComponent } from '../../profile/profile.component'

@Component({
  selector: 'page-suggestions',
  templateUrl: './suggestions.component.html'
})
export class SuggestionsComponent {
  featured: Array<any> = [];
  referenceToOldestKey;
  constructor(private modalCtrl: ModalController,
    private afs: AngularFirestore) {
    this.afs.collection<any>('profiles')
      .ref.orderBy('firstName')
      .limit(5)
      .get()
      .then((data: any) => {
        const profiles = data.docs.map(doc => {
          const d = doc.data();
          this.referenceToOldestKey = doc;
          return { _id: doc.id, ...d };
        });
        this.featured.push(...profiles);
      });
  }

  ngOnInit() {

  }

  showProfile(id) {
    let modal = this.modalCtrl.create(ProfileComponent, { profileId: id });
    modal.present();
  }

  doInfinite(): Promise<any> {
    return this.afs.collection<any>('profiles').ref
      .orderBy('firstName')
      .startAfter(this.referenceToOldestKey)
      .limit(5)
      .get()
      .then((data: any) => {
        const profiles = data.docs.map(doc => {
          const d = doc.data();
          this.referenceToOldestKey = doc;
          return { _id: doc.id, ...d };
        });
        this.featured.push(...profiles);
      })
  }
}
