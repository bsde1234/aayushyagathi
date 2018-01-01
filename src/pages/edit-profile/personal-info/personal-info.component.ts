import { Component, Host } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Tab, ToastController, LoadingController, Loading } from 'ionic-angular'

// import { LANGUAGES, COMPLEXION, GENDER } from '../../../app/app.constants'
import { OccupationComponent } from '../occupation/occupation.component'
import { AppService } from '../../../app/app.service'

@Component({
  selector: 'page-personal',
  templateUrl: './personal-info.component.html'
})
export class personalInfoComponent {
  personalInfo: FormGroup
  profile: any
  // CONSTANTS = { LANGUAGES, COMPLEXION, GENDER }
  _parent: Tab
  private minDate = new Date().getFullYear() - 35
  private maxDate = new Date().getFullYear() - 18
  private loading: Loading;
  constructor( @Host() _parent: Tab,
    private appService: AppService,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this._parent = _parent
    this.personalInfo = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      about: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      fatherName: new FormControl(null, [Validators.required]),
      dob: new FormControl(null, [Validators.required]),
      height: new FormControl(null, []),
      complexion: new FormControl(null, []),
      motherTongue: new FormControl(null, []),
      knownLanguages: new FormControl(null, []),
      permAddress: new FormGroup({
        address: new FormControl(null, []),
        city: new FormControl(null, []),
        state: new FormControl(null, [])
      })
    })

    this.appService.myProfileDoc.valueChanges().subscribe(profile => {
      this.profile = profile;
      this.profile.permAddress = this.profile.permAddress || {};
      const personalInfoValue = (({ firstName, lastName, about, gender, fatherName, dob, height,
        complexion, motherTongue, knownLanguages, permAddress: { address, city, state } }) => ({
          firstName, lastName, about, gender, fatherName, dob, height,
          complexion, motherTongue, knownLanguages, permAddress: { address, city, state }
        }))(this.profile || { permAddress: {} });
      if (personalInfoValue.dob)
        personalInfoValue.dob = (<Date>personalInfoValue.dob).toISOString()
      this.personalInfo.patchValue(personalInfoValue)
    });
  }

  saveAndNext() {
    Object.keys(this.personalInfo.controls)
      .forEach(key => {
        this.personalInfo.get(key).markAsTouched();
        this.personalInfo.get(key).markAsDirty();
        this.personalInfo.get(key).updateValueAndValidity({ onlySelf: false, emitEvent: true })
      });
    if (this.personalInfo.valid) {
      this.loading = this.loadingCtrl.create({
        content: 'Saving...'
      });
      this.loading.present();
      const personalInfoValue = {};
      Object.keys(this.personalInfo.value).forEach(key => {
        if (this.personalInfo.value[key] !== undefined) {
          personalInfoValue[key] = this.personalInfo.value[key];
        }
      });
      if (personalInfoValue['permAddress']) {
        Object.keys(personalInfoValue['permAddress']).forEach(key => {
          if (personalInfoValue['permAddress'][key] === undefined)
            delete personalInfoValue['permAddress'][key]
        })
      }
      if (personalInfoValue['dob'])
        personalInfoValue['dob'] = new Date(personalInfoValue['dob'])
      this.appService.myProfileDoc.update(personalInfoValue).then(() => {
        this._onSave();
      }, (err) => {
        this._onSave(err);
      });
    } else {
      const toast = this.toastCtrl.create({
        message: 'Please fill required fields',
        closeButtonText: 'ok',
        duration: 3000,
        showCloseButton: true
      });
      toast.present()
    }
  }

  private _onSave(err?) {
    this.loading.dismiss();
    if (err) throw new Error(err);
    const toast = this.toastCtrl.create({
      message: 'Personal Info Saved',
      closeButtonText: 'ok',
      duration: 3000
    });
    toast.present()
    this._parent.parent.select(2)
  }
}
