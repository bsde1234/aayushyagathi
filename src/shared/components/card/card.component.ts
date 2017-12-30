import { Component, Input } from '@angular/core'
import { ModalController } from 'ionic-angular'

import { ProfileComponent } from '../../../pages/profile/profile.component'

@Component({
  selector: 'user-profile',
  templateUrl: './card.component.html'
})

export class UserProfileComponent {
  @Input() user;
  noPhoto: string = 'images/placeholder.png'
  constructor(private modalCtrl: ModalController) {

  }

  showProfile(id) {
    let modal = this.modalCtrl.create(ProfileComponent, { profileId: id });
    modal.present();
  }
}
