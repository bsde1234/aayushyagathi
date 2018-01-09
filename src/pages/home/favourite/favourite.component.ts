import { Component } from '@angular/core'
import { AngularFirestore } from 'angularfire2/firestore';

import { AppService } from '../../../app/app.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin'

@Component({
  selector: 'page-favourite',
  templateUrl: './favourite.component.html'
})
export class FavouriteComponent {
  favouriteList: any = [];
  favourite: any
  constructor(private appService: AppService,
    private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.appService.userData$.subscribe(userData => {
      this.favourite = userData.favourites;
      const favourites = Object.keys(this.favourite).filter(id => this.favourite[id]);
      this.favouriteList = [];
      this.loadData(favourites);
    });
  }

  private loadData(favouriteList: Array<string>) {
    const docList = favouriteList.map(id => {
      var docRef = this.afs.collection('profiles').doc(id).valueChanges()
      docRef.subscribe(doc => {
        this.favouriteList.push(doc);
      });
      return docRef;
    });
    Observable.forkJoin(docList)
      .subscribe(docs => {
        console.log(docs)
        // this.favouriteList = docs
      });
  }
}
