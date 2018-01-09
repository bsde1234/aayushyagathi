import { Component } from '@angular/core'
import { ModalController } from 'ionic-angular'
import { AngularFirestore } from 'angularfire2/firestore';

import { ProfileComponent } from '../../profile/profile.component'
import { AppService } from '../../../app/app.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@Component({
  selector: 'page-suggestions',
  templateUrl: './suggestions.component.html'
})

export class SuggestionsComponent {
  featured = [];
  referenceToOldestKey;
  profile;
  isFinished = false;
  constructor(private modalCtrl: ModalController,
    private afs: AngularFirestore,
    private appService: AppService,
    private loading: LoadingController) {

    const loader = this.loading.create();
    loader.present();
    this.appService.myProfile$.subscribe((profile) => {
      this.profile = profile;
      if (profile) {
        this.loadDocs().then(() => { loader.dismiss(); });
      }
    })
  }

  showProfile(id) {
    let modal = this.modalCtrl.create(ProfileComponent, { profileId: id });
    modal.present();
  }

  private loadDocs() {
    return new Promise((resolve) => {
      const suggestionsObs = this.afs.collection<any>('profiles', ref => {
        var docRef: any = ref.orderBy("_id");
        if (this.referenceToOldestKey) {
          docRef = docRef.startAfter(this.referenceToOldestKey);
        }
        docRef = docRef.limit(20)
        return docRef;
      })
        .valueChanges()
        .subscribe(value => {
          if (value.length) {
            this.featured.push(...value);
            this.referenceToOldestKey = value[value.length - 1]._id;
          }
          resolve(value);
          suggestionsObs.unsubscribe();
        });
    });
  }

  doInfinite(evt): Promise<any> {
    return this.loadDocs();
  }
}
