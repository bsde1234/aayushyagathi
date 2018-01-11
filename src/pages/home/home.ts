import { Component } from '@angular/core';

import { SuggestionsComponent } from './suggestions/suggestions.component'
import { SettingsComponent } from './settings/settings.component'
import { FavouriteComponent } from './favourite/favourite.component'
import { PendingUsersComponent } from './advanced-search/search-result/search-result.component';
import { AppService } from '../../app/app.service';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  suggestions: any = SuggestionsComponent
  favourite: any = FavouriteComponent
  settings: any = SettingsComponent
  pendingUsers: any = PendingUsersComponent
  isModerator
  constructor(appService: AppService) {
    appService.isModerator$.subscribe(val => this.isModerator = val);
  }

}
