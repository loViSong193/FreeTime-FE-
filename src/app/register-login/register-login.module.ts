import { NgModule } from '@angular/core';
import { RegisterLoginComponent } from './register-login.component';
import { SharedModule } from '../module/share-module/shared.module';
import { CaptchaComponent } from '../module/core-module/capcha.component';

@NgModule({
  declarations: [RegisterLoginComponent, CaptchaComponent],
  imports: [
    SharedModule
  ],
  exports:[RegisterLoginComponent]
})
export class RegisterLoginModule { }
