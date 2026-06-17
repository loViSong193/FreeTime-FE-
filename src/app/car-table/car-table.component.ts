import { Component } from '@angular/core';
import { CarService } from './car.service';
import { Car, Paging } from '../car-interface/car-interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateUpdateCarComponent } from './create-update-car/create-update-car.component';
import { SpinnerService } from '../share-module/spinner/spinner.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-car-table',
  templateUrl: './car-table.component.html',
  styleUrls: ['./car-table.component.scss'],
  standalone: false,
})
export class CarTableComponent {
  text: string = '';
  listOfCar: Car[] = [];
  filterOfCar: Car[] = [];
  page: Paging = {
    page: 1,
    pageSize: 10,
    total: 0,
  };

  constructor(
    private carService: CarService,
    private modalService: NzModalService,
    private spinner: SpinnerService,
  ) {}

  ngOnInit() {
    this.getAllCars();
  }

  getAllCars() {
    this.spinner.show();
    const body = {
      page: this.page.page,
      pageSize: this.page.pageSize,
    };
    this.carService
      .getAllCars(body)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res) => {
          console.log(res);

          this.listOfCar = res.items;
          this.filterOfCar = [...res.items];
          this.page.total = res.total;
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
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
      // take data from child
      if (res) {
        if (res.action === 'update' && car && car._id) {
          this.carService.updateCar(car._id, res.data).subscribe({
            next: () => {
              this.getAllCars();
            },
          });
        } else if (res.action === 'create') {
          this.carService.createCar(res.data).subscribe({
            next: () => {
              this.getAllCars();
            },
          });
        }
      }
    });
  }

  deleteCar(id: string) {
    this.carService.deleteCar(id).subscribe(() => {
      this.getAllCars();
    });
  }

  //filter when mockAPI
  // onSearch() {
  //  const keyword = this.text.trim().toLowerCase();

  //   if (!keyword) {
  //     this.filterOfCar = [...this.listOfCar];
  //   }

  //   if (keyword) {
  //     this.filterOfCar = this.listOfCar.filter((obj) => {
  //       return (
  //         obj.brand.toLowerCase().includes(keyword) ||
  //         obj.color.toLowerCase().includes(keyword) ||
  //         obj.model.toLowerCase().includes(keyword)
  //       );
  //     });
  //   }
  // }

  //filter with API
  onSearch() {
    this.spinner.show();
    const body = {
      keyword: this.text,
      
    };
    this.carService
      .getAllCars(body)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res) => {
          console.log(res);

          return (this.filterOfCar = res.items);
        },
        error: () => {
          this.spinner.hide();
        },
      });
  }

  changePage(page: any) {
    console.log('page mới:', page);
    this.page.page = page;
    this.getAllCars();
  }

  changePageSize(pageSize: any) {
    console.log('pageSize mới:', pageSize);
    this.page.page = 1;
    this.page.pageSize = pageSize;
    this.getAllCars();
  }
}
