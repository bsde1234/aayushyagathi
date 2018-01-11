import { Component } from '@angular/core'
import { ModalController } from 'ionic-angular'
import { AngularFirestore } from 'angularfire2/firestore';

import { ProfileComponent } from '../../profile/profile.component'
import { AppService } from '../../../app/app.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';

@Component({
  selector: 'page-suggestions',
  templateUrl: './suggestions.component.html'
})

export class SuggestionsComponent {
  featured = [];
  referenceToOldestKey;
  profile;
  isFinished = false;
  break = false;
  loading = false;
  filterProps: any = { age: { lower: 18, upper: 40 } };
  constructor(private modalCtrl: ModalController,
    private afs: AngularFirestore,
    private appService: AppService,
    private loadingCtrl: LoadingController) {
    const loader = this.loadingCtrl.create({
      spinner: 'dots',
      dismissOnPageChange: true,
      content: 'Loading data...',
      enableBackdropDismiss: false
    });
    loader.present();
    this.appService.myProfile$.subscribe((profile) => {
      this.profile = profile;
      if (profile) {
        this.loadDocs().then(() => {
          loader.dismiss();
        });
      }
    });
  }

  showProfile(id) {
    let modal = this.modalCtrl.create(ProfileComponent, { profileId: id });
    modal.present();
  }

  private loadDocs(remaining?) {
    this.loading = true;
    var docRef = this.afs.collection('profiles').ref
      .orderBy('_id')
      .where('gender', "==", this.profile.gender === 1 ? 0 : 1)
      .where('isDisabled', '==', false)
    if (this.referenceToOldestKey) {
      docRef = docRef.startAfter(this.referenceToOldestKey);
    }
    return docRef
      .limit(20)
      .get()
      .then(value => {
        this.loading = false;
        if (value.size) {
          let docs = this.filterProfiles(value.docs.map(doc => doc.data()));
          if (docs.length) {
            this.featured.push(...docs);
            this.referenceToOldestKey = docs[docs.length - 1]._id;
          }
          if (remaining === undefined) {
            remaining = 20 - docs.length
          }
          if (remaining - docs.length > 0) {
            if (!this.break) { this.loadDocs(remaining - docs.length); }
            else {
              this.break = false;
            }
          }
        }
      });
  }


  filterProfiles(profiles: Array<any>) {
    return profiles
      .filter(doc => {
        let validator = true;
        const fromDate = new Date()
        fromDate.setFullYear(fromDate.getFullYear() - this.filterProps.age.upper)
        const toDate = new Date()
        toDate.setFullYear(toDate.getFullYear() - this.filterProps.age.lower)

        validator = validator &&
          (doc._id !== this.profile._id) &&
          (doc.dob > fromDate) &&
          (doc.dob < toDate)

        if (this.filterProps.firstName) {
          validator = validator &&
            ((doc.firstName || '').toLowerCase().indexOf(this.filterProps.firstName.toLowerCase()) !== -1)
        }
        if (this.filterProps.lastName) {
          validator = validator &&
            ((doc.lastName || '').toLowerCase().indexOf(this.filterProps.lastName.toLowerCase()) !== -1)
        }

        if (this.filterProps.education) {
          validator = validator &&
            (doc.education >= this.filterProps.education)
        }
        if (this.filterProps.occupation && this.filterProps.occupation.length) {
          validator = validator &&
            (this.filterProps.occupation.includes(doc.occupation))
        }
        if (this.filterProps.income) {
          validator = validator &&
            (doc.income >= this.filterProps.income)
        }
        return validator;
      });
  }

  doInfinite(evt): Promise<any> {
    return this.loadDocs();
  }

  openSearchFilter() {
    const searchFilterModal = this.modalCtrl
      .create(AdvancedSearchComponent, this.filterProps);
    searchFilterModal.onDidDismiss(data => {
      if (data) {
        this.filterProps = data;
        this.referenceToOldestKey = undefined;
        this.featured = [];
        const loader = this.loadingCtrl.create({
          spinner: 'dots',
          dismissOnPageChange: true,
          content: 'Loading data...',
          enableBackdropDismiss: false
        });
        loader.present();

        this.loadDocs().then(() => {
          loader.dismiss();
        });
      }
    })
    searchFilterModal
      .present();
  }

  stopSearch() {
    this.break = true;
  }

  doRefresh(refresher) {
    this.referenceToOldestKey = undefined;
    this.featured = [];
    this.loadDocs().then(() => {
      refresher.complete();
    });
  }
}
