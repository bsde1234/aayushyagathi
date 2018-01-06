import { Component } from '@angular/core'
import { NavParams, NavController } from 'ionic-angular'
import { AngularFirestore } from 'angularfire2/firestore';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular/components/slides/slides';

@Component({
  selector: 'page-profile',
  templateUrl: './profile.component.html',
  styles: [`
    .photo {
      height: 350px !important;
      width: calc(100vw - 20px) !important;
      margin: auto;
    }`]
})
export class ProfileComponent {
  private favourites: any
  profileData: any
  CONSTANTS
  noPhoto: string = 'assets/imgs/placeholder.png'
  profileId: string;
  @ViewChild('slides') slides: Slides;

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
          // this.slides.update(100);
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
