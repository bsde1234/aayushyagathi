import { Component } from '@angular/core'
import { ModalController } from 'ionic-angular'

import { ProfileComponent } from '../../../profile/profile.component'
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { AppService } from '../../../../app/app.service';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
@Component({
  selector: 'page-search-result',
  templateUrl: './search-result.component.html'
})
export class SearchResultComponent {
  profiles
  userProfile
  referenceToOldestKey;
  profileRef;
  isFinished = false
  CONSTANTS
  profilesDocRef
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private appService: AppService,
    private afs: AngularFirestore,
    private loader: LoadingController) {

    this.appService.myProfile$.subscribe(profile => {
      this.userProfile = profile;
      this.profiles = [];
      this.referenceToOldestKey;
      this.loadInitialData()
        .then(() => {
          this.loadDocs()
        });
    });
    this.appService.constants$.subscribe(val => this.CONSTANTS = val);
  }

  showProfile(id) {
    const modal = this.modalCtrl.create(ProfileComponent, { profileId: id })
    modal.present()
  }

  loadInitialData() {
    const loader = this.loader.create()
    loader.present();
    return this.afs.collection('profiles').ref
      .get()
      .then((data) => {
        loader.dismiss();
        this.profilesDocRef = data.docs;
      });
  }

  private loadDocs() {
    const query = this.navParams.data.query;
    const fromDate = new Date()
    fromDate.setFullYear(fromDate.getFullYear() - query.age.upper)
    const toDate = new Date()
    toDate.setFullYear(toDate.getFullYear() - query.age.lower)

    return new Promise((resolve, reject) => {
      let count = 0;

      while (this.profilesDocRef.length > 0) {
        var doc = this.profilesDocRef.splice(0, 1)[0];
        if (doc && doc.id !== this.userProfile._id) {
          const d = doc.data();
          let condition = true;
          condition = d.dob >= fromDate && d.dob < toDate
            && query.education !== undefined && d.education >= query.education
            // && query.occupation !== undefined && d.occupation >= query.occupation
            && query.complexion !== undefined && d.complexion >= query.complexion
            && query.income !== undefined && d.income >= query.income

          if (condition) {
            this.profiles.push({ _id: doc.id, ...d });
            count++;
            if (count >= 5) {
              resolve()
              return;
            }
          }
        }
      }
      this.isFinished = true;
      resolve();
    });
  }

  doInfinite() {
    return this.loadDocs();
  }
}
