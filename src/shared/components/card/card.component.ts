import { Component, Input } from '@angular/core'
import { ModalController } from 'ionic-angular'

import { ProfileComponent } from '../../../pages/profile/profile.component'
import { AppService } from '../../../app/app.service';

@Component({
  selector: 'user-profile',
  templateUrl: './card.component.html',
  styles: [`
  .photo {
    object-fit: cover;
    height:300px;
    width:calc(100vw - 20px);"
  }
  `]
})

export class UserProfileComponent {
  @Input() profile;
  CONSTANTS;
  noPhoto: string = 'assets/imgs/placeholder.png'
  constructor(
    private modalCtrl: ModalController,
    appService: AppService) {
    appService.constants$.subscribe(value => this.CONSTANTS = value);
  }

  showProfile(id) {
    let modal = this.modalCtrl.create(ProfileComponent, { profileId: id });
    modal.present();
  }
}
