import { NgModule } from '@angular/core';
import { RegisterLoginComponent } from './register-login.component';
import { SharedModule } from '../share-module/shared.module';

@NgModule({
  declarations: [RegisterLoginComponent],
  imports: [
    SharedModule
  ],
  exports:[RegisterLoginComponent]
})
export class RegisterLoginModule { }
