import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../environment'
import { MyApp } from './app.component';
import { LoginComponent } from '../pages/login/login.component';
import PAGES from '../pages'
import { SharedModule } from '../shared/shared.module'
import { AppService } from './app.service';
import { ErrorHanderService } from './error-handler.service';

@NgModule({
  declarations: [
    MyApp,
    LoginComponent,
    ...PAGES
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    SharedModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginComponent,
    ...PAGES
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: ErrorHanderService },
    AppService,
    Camera
  ]
})
export class AppModule { }
