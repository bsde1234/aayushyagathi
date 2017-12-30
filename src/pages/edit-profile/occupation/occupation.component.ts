import { Component, Host } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { Tab, NavController, ToastController, LoadingController, Loading } from 'ionic-angular'

// import { EDUCATION, OCCUPATION, INCOME_RANGE } from '../../../app/app.constants'

@Component({
  selector: 'page-occupation',
  templateUrl: './occupation.component.html'
})

export class OccupationComponent {
  // CONSTANTS = { EDUCATION, OCCUPATION, INCOME_RANGE }
  occupationForm: FormGroup
  _parent: Tab
  profile: any
  private loading: Loading

  constructor( @Host() _parent: Tab,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this._parent = _parent
    this.occupationForm = new FormGroup({
      education: new FormControl(null, []),
      occupation: new FormControl(null, []),
      income: new FormControl(null, []),
      resiAddress: new FormGroup({
        address: new FormControl(null, []),
        city: new FormControl(null, []),
        state: new FormControl(null, []),
      })
    })

    // this.profile = Meteor.users.findOne(Meteor.userId()).profile
    if (this.profile) {
      const occupation = (({ education, occupation, income, resiAddress: { address, city, state } }) =>
        ({ education, occupation, income, resiAddress: { address, city, state } }))
        (this.profile || { resiAddress: {} });
      this.occupationForm.patchValue(occupation)
    }
  }

  saveAndNext() {
    this.loading = this.loadingCtrl.create({
      content: 'Saving...'
    })
    this.loading.present()
    const personalInfoValue = {};
    for (let key in this.occupationForm.value) {
      personalInfoValue['profile.' + key] = this.occupationForm.value[key];
    }

    // Meteor.users.update(Meteor.userId(),
    //   { $set: personalInfoValue }, this._onSaved.bind(this))
  }

  private _onSaved(err) {
    this.loading.dismiss()
    if (err) throw Error(err);
    const toast = this.toastCtrl.create({
      message: 'Occupation Info Saved',
      closeButtonText: 'ok',
      duration: 3000
    })
    toast.present()
    this._parent.parent.select(2)
  }
}
