import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SuggestionsComponent } from './suggestions/suggestions.component'
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component'
import { SettingsComponent } from './settings/settings.component'
import { FavouriteComponent } from './favourite/favourite.component'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  suggestions: any = SuggestionsComponent
  advSearch: any = AdvancedSearchComponent
  favourite: any = FavouriteComponent
  settings: any = SettingsComponent

  constructor(public navCtrl: NavController) {

  }

}
