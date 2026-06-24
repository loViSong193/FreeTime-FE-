import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paging } from 'src/app/car-table/car-interface/car-interface';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: false,
})
export class PaginationComponent {
  @Input() page: Paging = {
    page: 1,
    pageSize: 10,
    total: 0,
  };

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onPageSizeChange(pageSize: number) {
    this.pageSizeChange.emit(pageSize);
  }
}
