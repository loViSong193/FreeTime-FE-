import { Component } from '@angular/core';
import { CarService } from './car.service';
import { Car, Paging } from './car-interface/car-interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateUpdateCarComponent } from './create-update-car/create-update-car.component';
import { SpinnerService } from '../module/share-module/spinner/spinner.service';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';
import { RegisterLoginService } from '../register-login/register-login.service';

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

  allChecked: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<string>();
  search$ = new Subject<string>();

  constructor(
    private carService: CarService,
    private modalService: NzModalService,
    private spinner: SpinnerService,
    private authService: RegisterLoginService,
  ) {}

  currentUser = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe((res) => {
      console.log(res);

      this.currentUser = res?.role;
    });
    this.getAllCars();
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((keyword) => {
        this.getAllCars();
      });
  }

  getAllCars() {
    this.spinner.show();
    this.carService
      .getAllCars(this.page, this.text)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res) => {
          console.log(res);

          this.listOfCar = res.items;
          this.filterOfCar = [...res.items];
          this.page.total = res.pagingInfo.totalItems;
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
    this.search$.next(this.text);
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

  updateCheckedSet(id: string | undefined, checked: boolean) {
    if (id) {
      if (checked) {
        this.setOfCheckedId.add(id);
      } else {
        this.setOfCheckedId.delete(id);
      }
    }
  }

  onItemChecked(id: string | undefined, checked: boolean) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean) {
    this.filterOfCar.forEach((item) => this.updateCheckedSet(item._id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus() {
    const validData = this.filterOfCar;
    this.allChecked =
      validData.length > 0 &&
      validData.every((item) => this.setOfCheckedId.has(item._id!));
    this.indeterminate =
      validData.some((item) => this.setOfCheckedId.has(item._id!)) &&
      !this.allChecked;
    console.log('Các ID đang được chọn:', Array.from(this.setOfCheckedId));
  }

  //simple export .docx
  exportWord() {
    const ids = Array.from(this.setOfCheckedId);
    if (ids.length === 0) {
      return;
    }
    this.spinner.show();
    this.carService
      .exportWord(ids)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (blob: Blob) => {
          console.log('this is blob', blob);
          
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cars.docx';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error: (err) => {
          console.error('Export failed', err);
        },
      });
  }

}
