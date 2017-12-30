import { Component } from '@angular/core'
import { NavController, ModalController, NavParams } from 'ionic-angular'

import { AppService } from '../../../../app/app.service'
import { ProfileComponent } from '../../../profile/profile.component'

@Component({
  selector: 'page-search-result',
  templateUrl: './search-result.component.html'
})
export class SearchResultComponent {
  profiles
  userProfile
  constructor(private appService: AppService,
    private navParams: NavParams,
    private modalCtrl: ModalController) {
    // this.userProfile = Meteor.user().profile
    const query = this.buildQuery(this.navParams.data.query)
    // this.profiles = MongoObservable.fromExisting(Meteor.users).find(query, { fields: { userId: 0 } })
  }

  showProfile(id) {
    const modal = this.modalCtrl.create(ProfileComponent, { profileId: id })
    modal.present()
  }

  private buildQuery(query) {
    const fromDate = new Date()
    fromDate.setFullYear(fromDate.getFullYear() - query.age.upper)

    const toDate = new Date()
    toDate.setFullYear(toDate.getFullYear() - query.age.lower)

    const q: any = {
      'profile.dob': { $gte: fromDate, $lte: toDate },
      'profile.gender': this.userProfile.gender ? 1 : 0,
      _id: { $ne: '' }
    }

    if (query.education != undefined) {
      q['profile.education'] = { $gte: query.education };
    }
    if (query.occupation != undefined) {
      q['profile.occupation'] = { $in: query.occupation }
    }
    if (query.complexion != undefined) {
      q['profile.complexion'] = { $lte: query.complexion }
    }
    if (query.city) {
      q['profile.city'] = { $regex: query.city, $options: 'i' }
    }
    if (query.state) {
      q['profile.state'] = new RegExp(query.state)
    }
    return q;
  }
}
