import { Component } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ToastController, LoadingController, Loading } from 'ionic-angular'
import * as firebase from "firebase";
// import { LANGUAGES, COMPLEXION, GENDER } from '../../../app/app.constants'
import { AppService } from '../../../app/app.service'
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  selector: 'page-personal',
  templateUrl: './personal-info.component.html'
})
export class personalInfoComponent {
  personalInfo: FormGroup
  profile: any
  CONSTANTS
  minDate = new Date().getFullYear() - 35
  maxDate = new Date().getFullYear() - 18
  private loading: Loading;
  recaptchaVerifier
  constructor(
    private navCtrl: NavController,
    private appService: AppService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController
  ) {
    this.appService.constants$.subscribe(constant => this.CONSTANTS = constant);
    this.personalInfo = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      mobile: new FormControl(null, [Validators.required]),
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
      const personalInfoValue = (({ firstName, lastName, mobile, gender, fatherName, dob, height,
        complexion, motherTongue, knownLanguages, permAddress: { address, city, state } }) => ({
          firstName, lastName, mobile, gender, fatherName, dob, height,
          complexion, motherTongue, knownLanguages, permAddress: { address, city, state }
        }))(this.profile || { permAddress: {} });
      if (personalInfoValue.dob)
        personalInfoValue.dob = (<Date>personalInfoValue.dob).toISOString()
      this.personalInfo.patchValue(personalInfoValue)
    });
  }
  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible'
    });
  }

  saveAndNext() {
    const mobileNumber = this.personalInfo.get('mobile').value;
    if (this.personalInfo.get('mobile').dirty) {
      this.addMobileNumber(mobileNumber);
    } else {
      this.saveData();
    }
  }

  saveData() {
    Object.keys(this.personalInfo.controls)
      .forEach(key => {
        this.personalInfo.get(key).markAsTouched();
        this.personalInfo.get(key).markAsDirty();
        this.personalInfo.get(key).updateValueAndValidity({ onlySelf: false, emitEvent: true })
      });
    if (this.personalInfo.valid) {
      this.loading = this.loadingCtrl.create({
        content: 'Saving...',
        spinner: 'dots'
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
    this.navCtrl.parent.select(1);
  }

  addMobileNumber(mobileNumber) {
    const loader = this.loadingCtrl.create({
      content: 'Saving...',
      spinner: 'dots'
    })
    loader.present();
    var a = new firebase.auth.PhoneAuthProvider(this.afAuth.auth)
    a.verifyPhoneNumber('+91' + mobileNumber, this.recaptchaVerifier)
      .then((verificationId) => {
        loader.dismiss();
        this.verifyOTP(verificationId);
      })
      .catch((err) => {
        loader.dismiss();
        if (err.code === "auth/invalid-phone-number") {
          this.alertCtrl.create({
            message: 'Invalid Phone Number',
            buttons: ['OK'],
            title: 'Error'
          }).present();
        } else {
          this.alertCtrl.create({
            message: err.message,
            buttons: ['OK'],
            title: 'Error'
          }).present();
        }
        // return err;
      });
  }

  private verifyOTP(verificationId) {
    const otpPrompt = this.alertCtrl.create({
      title: 'Enter Verification code',
      inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            otpPrompt.dismiss();
          }
        },
        {
          text: 'Send',
          handler: data => {
            const auth = firebase.auth.PhoneAuthProvider
              .credential(verificationId, data.confirmationCode)
            this.afAuth.auth.currentUser.updatePhoneNumber(auth)
              .then(() => {
                this.saveData();
              })
              .catch(err => {
                if (err.code === 'auth/invalid-verification-code') {
                  this.alertCtrl.create({
                    message: 'Invalid Verification Code, Please try again.'
                  }).present().then(() => {
                    this.verifyOTP(verificationId);
                  });
                }
              })
          }
        }
      ]
    });
    otpPrompt
      .present();
  }
}
