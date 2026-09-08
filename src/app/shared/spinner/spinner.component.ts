import { Component } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [NgxSpinnerModule],
})
export class SpinnerComponent {

  constructor(private spinnerService: SpinnerService) {}

}
