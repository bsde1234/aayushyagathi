import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular';

import { UserProfileComponent } from './components/card/card.component'

@NgModule({
  imports: [IonicModule],
  declarations: [UserProfileComponent],
  entryComponents: [UserProfileComponent],
  exports: [UserProfileComponent]
})
export class SharedModule {

}