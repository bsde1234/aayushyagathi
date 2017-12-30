import { Component, ViewChild } from '@angular/core'
import { Tabs } from 'ionic-angular'

import { personalInfoComponent } from './personal-info/personal-info.component'
import { ExpectionsComponent } from './expections/expections.component'
import { OccupationComponent } from './occupation/occupation.component'
import { PhotoComponent } from './photo/photo.component'

@Component({
  selector: 'page-edit-profile',
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent {
  @ViewChild(Tabs) tabs: Tabs
  personalInfo = personalInfoComponent
  occupation = OccupationComponent
  expections = ExpectionsComponent
  photo = PhotoComponent

  tabTitle: string
}
