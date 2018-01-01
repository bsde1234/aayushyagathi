import { Component } from '@angular/core'
import { NavController, ModalController } from 'ionic-angular'
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { ProfileComponent } from '../../profile/profile.component'
import { AppService } from '../../../app/app.service';

@Component({
  selector: 'page-suggestions',
  templateUrl: './suggestions.component.html'
})
export class SuggestionsComponent {
  featured: Observable<any[]>;

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private afs: AngularFirestore,
    private appService: AppService) {
    let featuredCollection = this.afs.collection<any>('profiles')
    this.featured = featuredCollection.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const _id = a.payload.doc.id;
          return { _id, ...data };
        });
      });
  }

  ngOnInit() {

  }

  showProfile(id) {
    let modal = this.modalCtrl.create(ProfileComponent, { profileId: id });
    modal.present();
  }
}
