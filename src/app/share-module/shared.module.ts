import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerComponent } from './spinner/spinner.component';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [PaginationComponent, SpinnerComponent],
  imports: [CommonModule, NzPaginationModule, NgxSpinnerModule, NzTableModule],
  exports: [PaginationComponent, SpinnerComponent, NzTableModule],
})
export class SharedModule {}
