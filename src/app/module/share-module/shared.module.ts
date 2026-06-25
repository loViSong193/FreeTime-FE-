import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerComponent } from './spinner/spinner.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { UserOutline, LockOutline } from '@ant-design/icons-angular/icons';
import { HttpClientModule } from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  providers: [{ provide: NZ_ICONS, useValue: [UserOutline, LockOutline] }],
  declarations: [PaginationComponent, SpinnerComponent],
  imports: [
    CommonModule,
    NzPaginationModule,
    NgxSpinnerModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    HttpClientModule,
    FormsModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzMessageModule,
  ],
  exports: [
    CommonModule,
    NzPaginationModule,
    NgxSpinnerModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    HttpClientModule,
    FormsModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzMessageModule,
    PaginationComponent,
    SpinnerComponent,
  ],
})
export class SharedModule {}
