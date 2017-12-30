import { Component } from '@angular/core'
import { NavParams, NavController } from 'ionic-angular'

@Component({
  selector: 'page-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private favourites: any
  profileData: any
  CONSTANTS = {}
  noPhoto: string = 'images/placeholder.png'
  profileId: string;

  constructor(private params: NavParams,
    private navCtrl: NavController) {
  }

  ngOnInit() {
    this.profileId = this.params.get('profileId')
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
