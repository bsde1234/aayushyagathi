import { Component } from '@angular/core'
import { NavParams, NavController } from 'ionic-angular'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private favourites: any
  profileData: any
  CONSTANTS
  noPhoto: string = '../assets/imgs/placeholder.png'
  profileId: string;

  constructor(private params: NavParams,
    private navCtrl: NavController,
    private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.profileId = this.params.get('profileId')
    this.afs.collection('profiles')
      .doc(this.profileId).valueChanges()
      .subscribe(data => {
        if (data) {
          this.profileData = data;
        }
      })
    // this.profileData = Meteor.users.findOne(this.profileId).profile;
    // this.favourites = Meteor.user().profile.favourite;
  }

  closeModal() {
    this.navCtrl.pop();
  }

  markFavourite(id, favourites) {
    // Meteor.call('toggleFavourite', id, favourites);
    if (favourites) {
      this.favourites.push(id)
    } else {
      this.favourites.splice(this.favourites.indexOf(id))
    }
  }
}
