import { Component } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'

// import { COMPLEXION, EDUCATION, OCCUPATION, INCOME_RANGE } from '../../../app/app.constants'
import { SearchResultComponent } from './search-result/search-result.component'
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AppService } from '../../../app/app.service';

@Component({
  selector: 'page-advanced-search',
  templateUrl: './advanced-search.component.html'
})

export class AdvancedSearchComponent {
  searchForm: FormGroup
  ageRange: FormControl
  CONSTANTS;
  constructor(private navCtrl: NavController,
    private appService: AppService) {

    this.searchForm = new FormGroup({
      firstName: new FormControl(null, []),
      lastName: new FormControl(null, []),
      education: new FormControl(null, []),
      occupation: new FormControl(null, []),
      income: new FormControl(null, []),
      age: new FormControl(null),
    })
    this.ageRange = <FormControl>this.searchForm.get('age');
    this.ageRange.setValue({ lower: 18, upper: 40 });
    this.appService.constants$.subscribe(data => this.CONSTANTS = data);
  }

  search() {
    this.navCtrl.parent.parent.push(SearchResultComponent, { query: this.searchForm.value });
  }
}
