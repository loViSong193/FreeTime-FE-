import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarTableComponent } from './car-table.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateUpdateCarComponent } from './create-update-car/create-update-car.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [CarTableComponent, CreateUpdateCarComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    NzModalModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule
  ],
  exports: [CarTableComponent]
})
export class CarModule { }
