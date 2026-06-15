// import {
//   Component,
//   EventEmitter,
//   Inject,
//   Input,
//   OnChanges,
//   Output,
//   SimpleChanges,
// } from '@angular/core';

// import { FormBuilder, Validators } from '@angular/forms';

// import { Car } from '../../car-interface/car-interface';
// import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

// @Component({
//   selector: 'app-create-update-car',
//   templateUrl: './create-update-car.component.html',
//   styleUrls: ['./create-update-car.component.scss'],
//   standalone: false,
// })
// export class CreateUpdateCarComponent {
//   constructor(
//     @Inject(NZ_MODAL_DATA) public data: any,
//     private modalRef: NzModalRef,
//     private fb: FormBuilder
//   ) {}
  
//   isSubmitting = false;
  

//   carForm = this.fb.group({
//     brand: ['', Validators.required],
//     model: ['', Validators.required],
//     color: ['', Validators.required],
//     price: ['', Validators.required],
//     status: ['', Validators.required],
//   })

//   ngOnInit() {
//     if (this.data && this.data.car) {
//       this.carForm.patchValue(this.data.car);
//     }
//   }

//   submit() {
//     if (this.carForm.valid) {
//       // Truyền data ra thằng cha thông qua modalRef.close
//       this.modalRef.close({
//         action: 'submit',
//         data: this.carForm.value
//       });
//     } else {
//       Object.values(this.carForm.controls).forEach(control => {
//         if (control.invalid) {
//           control.markAsDirty();
//           control.updateValueAndValidity({ onlySelf: true });
//         }
//       });
//     }
//   }
  

//   onCancel() {
//     this.modalRef.close({
//       action: 'cancel'
//     })
//   }
// }
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-update-car',
  templateUrl: './create-update-car.component.html',
  styleUrls: ['./create-update-car.component.scss'],
  standalone: false,
})
export class CreateUpdateCarComponent implements OnInit {
  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modalRef: NzModalRef,
    private fb: FormBuilder
  ) {}

  isSubmitting = false;

  carForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();

    if (this.isEditMode) {
      this.patchFormData();
    }
  }

  get isEditMode(): boolean {
    return !!this.data?.car;
  }

  private initForm(): void {
    this.carForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      price: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  private patchFormData(): void {
    const value = this.data.car
    this.carForm.patchValue({
      brand: value.brand,
      model: value.model,
      color: value.color,
      price: value.price,
      status: value.status,
    });
  }

  submit(): void {
    if (this.carForm.invalid) {
      this.markFormDirty();
      return;
    }

    this.modalRef.close({
      action: this.isEditMode ? 'update' : 'create',
      data: this.carForm.getRawValue(),
    });
  }

  private markFormDirty(): void {
    Object.values(this.carForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }

  onCancel(): void {
    this.modalRef.close({
      action: 'cancel',
    });
  }
}
