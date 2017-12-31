import { Component } from '@angular/core'
import { NavController, App, ModalController } from 'ionic-angular'
import { LoginComponent } from '../../login/login.component'
import { AppService } from '../../../app/app.service'

import { EditProfileComponent } from '../../edit-profile/edit-profile.component'

@Component({
  selector: 'page-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  user
  noPhoto: string = '../assets/imgs/placeholder.png'
  constructor(private navCtrl: NavController,
    private app: App,
    private appService: AppService,
    private modalCtrl: ModalController) {
  }

  ngOnInit() {
    // this.user = Meteor.user()
  }

  logout() {
    // Meteor.logout(() => {
    //   // Improvement needed
    //   this.app.getRootNav().setRoot(LoginComponent)
    // })
  }

  viewProfile() {
    this.navCtrl.parent.parent.push(EditProfileComponent, {})
  }

  aboutUs() {

  }
}
