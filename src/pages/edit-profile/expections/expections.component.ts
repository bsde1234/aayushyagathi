import { Component, Host } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { ToastController, Tab, Loading, LoadingController } from 'ionic-angular'

// import { COMPLEXION, EDUCATION, OCCUPATION, INCOME_RANGE } from '../../../app/app.constants'
import { AppService } from '../../../app/app.service'
@Component({
  selector: 'page-expections',
  templateUrl: './expections.component.html'
})

export class ExpectionsComponent {
  expectionsForm: FormGroup
  profile: any
  _parent: Tab
  ageRange: FormControl
  CONSTANTS
  private loading: Loading
  constructor( @Host() _parent: Tab,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private appService: AppService
  ) {
    this._parent = _parent
    this.appService.constants$.subscribe(constant => this.CONSTANTS = constant);
    this.expectionsForm = new FormGroup({
      education: new FormControl(null, []),
      occupation: new FormControl(null, []),
      income: new FormControl(null, []),
      complexion: new FormControl(null),
      age: new FormControl({ lower: 18, upper: 40 })
    })
    this.appService.myProfile$.subscribe(profile => {
      this.profile = profile;
      if (this.profile) {
        const expectionsValues = (({ education, occupation, income, complexion, age }) =>
          ({ education, occupation, income, complexion, age }))(this.profile.partner || {});

        this.expectionsForm.patchValue(expectionsValues)
        this.ageRange = <FormControl>this.expectionsForm.get('age')
        if (!this.ageRange.value) this.ageRange.setValue({ lower: 18, upper: 40 });
      }
    });
  }

  saveAndNext() {
    this.loading = this.loadingCtrl.create({
      content: 'Saving...',
      spinner: 'dots'
    })
    this.loading.present()
    const expectionFormValue = this.expectionsForm.value
    this.appService.myProfileDoc
      .update(expectionFormValue)
      .then(() => this._onSaved(), (err) => this._onSaved(err));
  }

  private _onSaved(err?) {
    this.loading.dismiss()
    if (err) throw new Error(err);
    const toast = this.toastCtrl.create({
      message: 'Expection Info Saved',
      closeButtonText: 'ok',
      duration: 3000,
      showCloseButton: true
    })
    toast.present()
    this._parent.parent.select(3)
  }
}
