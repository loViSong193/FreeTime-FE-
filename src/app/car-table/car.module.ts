import { NgModule } from '@angular/core';
import { CarTableComponent } from './car-table.component';
import { CreateUpdateCarComponent } from './create-update-car/create-update-car.component';
import { SharedModule } from '../module/share-module/shared.module';

@NgModule({
  declarations: [CarTableComponent, CreateUpdateCarComponent, ],
  imports: [
    SharedModule,
  ],
  exports: [CarTableComponent]
})
export class CarModule { }
