import { Component } from '@angular/core'
import { NavController, ModalController } from 'ionic-angular'

import { ProfileComponent } from '../../profile/profile.component'


@Component({
  selector: 'page-suggestions',
  templateUrl: './suggestions.component.html'
})
export class SuggestionsComponent {
  featured: any

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController) {
  }

  ngOnInit() {

  }

  showProfile(id) {
    let modal = this.modalCtrl.create(ProfileComponent, { profileId: id });
    modal.present();
  }
}
