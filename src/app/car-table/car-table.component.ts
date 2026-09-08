import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService } from './car.service';
import { Car, Paging } from './car-interface/car-interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CreateUpdateCarComponent } from './create-update-car/create-update-car.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { RegisterLoginService } from '../register-login/register-login.service';

@Component({
  selector: 'app-car-table',
  templateUrl: './car-table.component.html',
  styleUrls: ['./car-table.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NzTableModule, NzButtonModule, NzInputModule, PaginationComponent],
})
export class CarTableComponent implements OnInit, OnDestroy {
  text: string = '';

  cars: Car[] = [];
  page: Paging = {
    page: 1,
    pageSize: 10,
    total: 0,
  };

  allChecked: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<string>();
  search$ = new Subject<string>();

  currentUser: string | null = null;

  private subscriptions = new Subscription();

  constructor(
    private carService: CarService,
    private modalService: NzModalService,
    private spinner: SpinnerService,
    private authService: RegisterLoginService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.currentUser$.subscribe((res) => {
        this.currentUser = res?.role;
      })
    );

    this.subscriptions.add(
      this.carService.cars$.subscribe((cars) => {
        this.cars = cars;
      })
    );

    this.subscriptions.add(
      this.carService.paging$.subscribe((p) => {
        this.page = { page: p.page, pageSize: p.pageSize, total: p.totalItems };
      })
    );

    this.carService.loadCars().subscribe();

    this.subscriptions.add(
      this.search$
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => {
          this.carService.search(this.text);
          this.carService.loadCars().subscribe();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSearch(): void {
    this.search$.next(this.text);
  }

  changePage(page: number): void {
    this.carService.setPage(page);
    this.carService.loadCars().subscribe();
  }

  changePageSize(pageSize: number): void {
    this.carService.setPageSize(pageSize);
    this.carService.loadCars().subscribe();
  }

  openModal(car: Car | null): void {
    const modalRef = this.modalService.create({
      nzTitle: car ? 'Cập nhật xe' : 'Nhập thêm xe',
      nzContent: CreateUpdateCarComponent,
      nzData: { car },
      nzFooter: null,
    });

    this.subscriptions.add(
      modalRef.afterClose.subscribe((res) => {
        if (!res) return;

        if (res.action === 'update' && car?._id) {
          this.carService.updateCar(car._id, res.data).subscribe();
        } else if (res.action === 'create') {
          this.carService.createCar(res.data).subscribe();
        }
      })
    );
  }

  deleteCar(id: string): void {
    this.carService.deleteCar(id).subscribe();
  }

  updateCheckedSet(id: string | undefined, checked: boolean): void {
    if (!id) return;
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string | undefined, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.cars.forEach((item) => this.updateCheckedSet(item._id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const validData = this.cars;
    this.allChecked =
      validData.length > 0 &&
      validData.every((item) => this.setOfCheckedId.has(item._id!));
    this.indeterminate =
      validData.some((item) => this.setOfCheckedId.has(item._id!)) &&
      !this.allChecked;
  }

  exportWord(): void {
    const ids = Array.from(this.setOfCheckedId);
    if (ids.length === 0) return;

    this.spinner.show();
    this.carService.exportWord(ids).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cars.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }
}
