import { Component } from '@angular/core';
import { CarService } from './car.service';
import { Car } from '../car-interface/car-interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateUpdateCarComponent } from './create-update-car/create-update-car.component';

@Component({
  selector: 'app-car-table',
  templateUrl: './car-table.component.html',
  styleUrls: ['./car-table.component.scss'],
  standalone: false,
})
export class CarTableComponent {
  constructor(
    private carService: CarService,
    private modalService: NzModalService,
  ) {}

  ngOnInit() {
    this.getAllCars();
  }

  listOfCar: Car[] = [];

  getAllCars() {
    this.carService.getAllCars().subscribe({
      next: (res) => {
        console.log(res);

        this.listOfCar = res;
      },
    });
  }

  openModal(car: any) {
    const modalRef = this.modalService.create({
      nzTitle: car ? 'Cập nhật xe' : 'Nhập thêm xe',
      nzContent: CreateUpdateCarComponent,
      nzData: {
        car,
      },
      nzFooter: null,
    });
    
    modalRef.afterClose.subscribe((res) => {
      // Nhận data từ con
      if (res) {
        if (res.action === 'update' && car && car._id) {
          this.carService.updateCar(car._id, res.data).subscribe({
            next: () => {
              this.getAllCars();
            }
          });
        } else if (res.action === 'create') {
          this.carService.createCar(res.data).subscribe({
            next: () => {
              this.getAllCars();
            }
          });
        }
      }
    });
  }

  deleteCar(id: string) {
    this.carService.deleteCar(id).subscribe(() =>  {
      this.getAllCars()
    } 
    )
  }
}
