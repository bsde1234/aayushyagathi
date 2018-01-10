import { Component } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';

import { AppService } from '../../../app/app.service';

@Component({
  selector: 'page-advanced-search',
  templateUrl: './advanced-search.component.html'
})

export class AdvancedSearchComponent {
  searchForm: FormGroup
  ageRange: FormControl
  CONSTANTS;
  constructor(
    private appService: AppService,
    private viewCtrl: ViewController,
    private navParams: NavParams) {

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
    this.searchForm.patchValue(this.navParams.data);
  }

  search() {
    this.viewCtrl.dismiss(this.searchForm.value);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
