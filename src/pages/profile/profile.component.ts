import { Component, ElementRef, NgZone } from '@angular/core'
import { NavParams, NavController } from 'ionic-angular'
import { AngularFirestore } from 'angularfire2/firestore';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular/components/slides/slides';
import { AppService } from '../../app/app.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@Component({
  selector: 'page-profile',
  templateUrl: './profile.component.html',
  styles: [`
    .card-md{
      margin: 5px 0 0 0;
      width: 100%;
    }`]
})
export class ProfileComponent {
  public favourites: any
  profileData: any
  CONSTANTS
  userPhoto: string = 'assets/imgs/placeholder.png'
  profileId: string;
  isModerator = false;
  imageLoader;
  @ViewChild('userPhoto') elementView: ElementRef;

  constructor(private params: NavParams,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private appService: AppService,
    private loader: LoadingController,
    private toast: ToastController,
    private ngZone: NgZone) {
  }

  ngOnInit() {
    const loader = this.loader.create({
      content: 'Loading profile...',
      spinner: 'dots'
    });
    loader.present();
    this.profileId = this.params.get('profileId')
    this.afs.collection('profiles')
      .doc(this.profileId).valueChanges()
      .subscribe(data => {
        loader.dismiss();
        if (data) {
          this.profileData = data;
        }
      });
    this.appService.constants$.subscribe(constants => this.CONSTANTS = constants);
    this.appService.userData$.subscribe(userData => this.favourites = userData.favourites);
    this.appService.isModerator$.subscribe(isModerator => this.isModerator = isModerator);
  }

  closeModal() {
    this.navCtrl.pop();
  }

  markFavourite(id, favourites) {
    this.appService.toggleShortlist(id, favourites).then(() => {
      if (favourites) {
        this.toast.create({
          message: 'Profile added to favourite',
          duration: 1500,
          position: 'bottom',
          dismissOnPageChange: true,
          showCloseButton: true
        }).present();
      } else {
        this.toast.create({
          message: 'Profile removed from favourite',
          duration: 1500,
          position: 'bottom',
          dismissOnPageChange: true,
          showCloseButton: true
        }).present();
      }
    });
  }

  approveProfile(id) {
    this.afs
      .collection('profiles')
      .doc(id)
      .update({ isDisabled: false })
      .then(() => {
        this.toast.create({
          message: 'User Approved',
          duration: 1000,
          dismissOnPageChange: true,
          position: 'bottom',
          showCloseButton: true
        }).present();
      });
  }

  loadPhoto() {
    if (this.profileData.thumbUrl) {
      this.imageLoader = true;
      this.userPhoto = this.profileData.thumbUrl;
      const img = new Image();
      img.onload = (evt) => {
        this.userPhoto = this.profileData.photo;
        this.imageLoader = false;
      }
      img.src = this.profileData.photo;
    }
  }
}
