import { Injectable, ErrorHandler, Injector } from '@angular/core'
import { AlertController } from 'ionic-angular'

@Injectable()
export class ErrorHanderService implements ErrorHandler {
  constructor(private injector: Injector) {

  }
  handleError(error) {
    console.error(error)
    const alert = this.injector.get(AlertController);
    alert.create({
      message: error.Message || 'Unknown Error',
      title: 'Error',
      enableBackdropDismiss: true,
      buttons: ['OK']
    })
      .present()
  }
}
