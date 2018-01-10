import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SuggestionsComponent } from './suggestions/suggestions.component'
import { SettingsComponent } from './settings/settings.component'
import { FavouriteComponent } from './favourite/favourite.component'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  suggestions: any = SuggestionsComponent
  favourite: any = FavouriteComponent
  settings: any = SettingsComponent

  constructor(public navCtrl: NavController) {

  }

}
