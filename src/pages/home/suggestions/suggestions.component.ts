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
  featured: Array<any> = [];
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
        this.featured = [];
        this.loadDocs();
        loader.dismiss();
      }
    })
  }

  showProfile(id) {
    let modal = this.modalCtrl.create(ProfileComponent, { profileId: id });
    modal.present();
  }

  private loadDocs() {
    let ref: any = this.afs.collection<any>('profiles').ref
    if (this.referenceToOldestKey) {
      ref = ref.startAfter(this.referenceToOldestKey)
    }

    return ref
      .limit(20)
      .get()
      .then((data: any) => {
        const documents = data.docs.filter(doc => doc.id !== this.profile._id);
        const profiles = documents.map(doc => {
          const d = doc.data();
          this.referenceToOldestKey = doc;
          return { _id: doc.id, ...d };
        });
        this.featured.push(...profiles);
        if (data.size < 20) this.isFinished = true;
      });
  }

  doInfinite(): Promise<any> {
    return this.loadDocs();
  }
}
