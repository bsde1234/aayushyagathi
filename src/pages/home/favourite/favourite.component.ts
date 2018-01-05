import { Component } from '@angular/core'

// import { AppService } from '../../../app/app.service'

@Component({
  selector: 'page-favourite',
  templateUrl: './favourite.component.html'
})
export class FavouriteComponent {
  favouriteList: any;
  favourite: any
  constructor() {
  }

  ngOnInit() {
    // const favouriteList = Meteor.user().profile.favourite;

    // MongoObservable.fromExisting(Meteor.users).find(Meteor.userId()).observe({
    //   changedAt: (doc) => {
    //     this.loadData(Meteor.user().profile.favourite)
    //   }
    // })
    this.loadData('favouriteList')
  }

  private loadData(favouriteList) {
    // this.favourite = MongoObservable.fromExisting(Meteor.users)
    //   .find({ _id: { $in: favouriteList || [] } })
  }
}
