import { Component } from '@angular/core'
import { AngularFirestore } from 'angularfire2/firestore';

import { AppService } from '../../../app/app.service';

@Component({
  selector: 'page-favourite',
  templateUrl: './favourite.component.html'
})
export class FavouriteComponent {
  favouriteList: any = [];
  favourites;
  constructor(private appService: AppService,
    private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.appService.userData$.subscribe(userData => {
      const favourite = userData.favourites;
      this.favourites = Object.keys(favourite).filter(id => favourite[id]);
      this.favouriteList = [];
      this.loadData();
    });
  }

  private loadData(refresher?) {
    this.afs.collection('profiles')
      .snapshotChanges()
      .map(data => {
        let filtered = data.filter(doc => {
          const result = doc.payload.doc.exists && (this.favourites.indexOf(doc.payload.doc.id) !== -1);
          return !!result;
        }).map(doc => doc.payload.doc.data());
        return filtered;
      })
      .subscribe(data => {
        this.favouriteList = data;
        if (refresher) {
          refresher.complete();
        }
      })
  }

  doRefresh(refreshEvent) {
    this.loadData(refreshEvent);
  }
}
