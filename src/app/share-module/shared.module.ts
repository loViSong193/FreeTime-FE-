import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerComponent } from './spinner/spinner.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [PaginationComponent, SpinnerComponent],
  imports: [CommonModule, NzPaginationModule, NgxSpinnerModule, NzTableModule, NzButtonModule, NzIconModule],
  exports: [PaginationComponent, SpinnerComponent, NzTableModule, NzButtonModule, NzIconModule],
})
export class SharedModule {}
