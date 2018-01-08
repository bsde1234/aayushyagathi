import { Component, Host } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { Tab, ToastController, LoadingController, Loading } from 'ionic-angular'
import { AppService } from '../../../app/app.service'
// import { EDUCATION, OCCUPATION, INCOME_RANGE } from '../../../app/app.constants'

@Component({
  selector: 'page-occupation',
  templateUrl: './occupation.component.html'
})

export class OccupationComponent {
  CONSTANTS
  occupationForm: FormGroup
  _parent: Tab
  profile: any
  private loading: Loading

  constructor( @Host() _parent: Tab,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private appService: AppService
  ) {
    this._parent = _parent
    this.appService.constants$.subscribe(constant => this.CONSTANTS = constant);
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
    this.appService.myProfileDoc.valueChanges().subscribe(profile => {
      this.profile = profile;
      this.profile.resiAddress = this.profile.resiAddress || {};
      if (this.profile) {
        const occupation = (({ education, occupation, income, resiAddress: { address, city, state } }) =>
          ({ education, occupation, income, resiAddress: { address, city, state } }))
          (this.profile || { resiAddress: {} });
        this.occupationForm.patchValue(occupation)
      }
    })
  }

  saveAndNext() {
    this.loading = this.loadingCtrl.create({
      content: 'Saving...'
    })
    this.loading.present()
    const personalInfoValue = {};
    for (let key in this.occupationForm.value) {
      if (this.occupationForm.value[key] !== undefined) {
        personalInfoValue[key] = this.occupationForm.value[key];
      }
    }

    for (let key in personalInfoValue['resiAddress']) {
      if (personalInfoValue['resiAddress'][key] === undefined) {
        delete personalInfoValue['resiAddress'][key];
      }
    }
    this.appService.myProfileDoc
      .update(personalInfoValue)
      .then(() => {
        this._onSaved(null);
      }, (err) => {
        this._onSaved(err);
      })
  }

  private _onSaved(err) {
    this.loading.dismiss()
    if (err) throw Error(err);
    const toast = this.toastCtrl.create({
      message: 'Occupation Info Saved',
      closeButtonText: 'ok',
      duration: 3000,
      showCloseButton: true
    })
    toast.present()
    this._parent.parent.select(2)
  }
}
