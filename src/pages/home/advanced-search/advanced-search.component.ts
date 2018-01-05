import { Component } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'

// import { COMPLEXION, EDUCATION, OCCUPATION, INCOME_RANGE } from '../../../app/app.constants'
import { SearchResultComponent } from './search-result/search-result.component'
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
  selector: 'page-advanced-search',
  templateUrl: './advanced-search.component.html'
})

export class AdvancedSearchComponent {
  searchForm: FormGroup
  ageRange: FormControl
  // CONSTANTS = { COMPLEXION, EDUCATION, OCCUPATION, INCOME_RANGE }
  constructor(private navCtrl: NavController) {
    this.searchForm = new FormGroup({
      education: new FormControl(null, []),
      occupation: new FormControl(null, []),
      income: new FormControl(null, []),
      complexion: new FormControl(null),
      age: new FormControl(null),
      city: new FormControl(null),
      state: new FormControl(null)
    })
    this.ageRange = <FormControl>this.searchForm.get('age')
    this.ageRange.setValue({ lower: 18, upper: 40 })
  }

  search() {
    this.navCtrl.parent.parent.push(SearchResultComponent, { query: this.searchForm.value })
  }
}
