import { Component, Host } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { ToastController, Tab, Loading, LoadingController } from 'ionic-angular'

// import { COMPLEXION, EDUCATION, OCCUPATION, INCOME_RANGE } from '../../../app/app.constants'

@Component({
  selector: 'page-expections',
  templateUrl: './expections.component.html'
})

export class ExpectionsComponent {
  expectionsForm: FormGroup
  profile: any
  _parent: Tab
  ageRange: FormControl
  // CONSTANTS = { COMPLEXION, EDUCATION, OCCUPATION, INCOME_RANGE }
  private loading: Loading
  constructor( @Host() _parent: Tab,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this._parent = _parent

    this.expectionsForm = new FormGroup({
      education: new FormControl(null, []),
      occupation: new FormControl(null, []),
      income: new FormControl(null, []),
      complexion: new FormControl(null),
      age: new FormControl({ lower: 18, upper: 40 }),
      city: new FormControl(null),
      state: new FormControl(null)
    })
    // this.profile = Meteor.users.findOne(Meteor.userId()).profile

    if (this.profile) {
      const expectionsValues = (({ education, occupation, income, complexion, age, city, state }) =>
        ({ education, occupation, income, complexion, age, city, state }))(this.profile.partner || {});

      this.expectionsForm.patchValue(expectionsValues)
      this.ageRange = <FormControl>this.expectionsForm.get('age')
      if (!this.ageRange.value) this.ageRange.setValue({ lower: 18, upper: 40 });
    }
  }

  saveAndNext() {
    this.loading = this.loadingCtrl.create({
      content: 'Saving...'
    })
    this.loading.present()
    const expectionFormValue = this.expectionsForm.value
    // Meteor.users.update(Meteor.userId(),
    //   { $set: { 'profile.partner': expectionFormValue } }, this._onSaved.bind(this))
  }

  private _onSaved(err) {
    this.loading.dismiss()
    if (err) throw new Error(err);
    const toast = this.toastCtrl.create({
      message: 'Expection Info Saved',
      closeButtonText: 'ok',
      duration: 3000
    })
    toast.present()
    this._parent.parent.select(3)
  }
}
