import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

import { Car } from '../../car-interface/car-interface';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-update-car',
  templateUrl: './create-update-car.component.html',
  styleUrls: ['./create-update-car.component.scss'],
  standalone: false,
})
export class CreateUpdateCarComponent {
  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modalRef: NzModalRef,
    private fb: FormBuilder
  ) {}
  

  carForm = this.fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    color: ['', Validators.required],
    price: ['', Validators.required],
    status: ['', Validators.required],
  })

  ngOnInit() {}

  submit() {
     this.modalRef.close({
      action: 'submit',

     })
     
  }
  

  onCancel() {
    this.modalRef.close({
      action: 'cancel'
    })
  }
}
