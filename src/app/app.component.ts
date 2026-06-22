import { Component } from '@angular/core';
import { RegisterLoginService } from './register-login/register-login.service';
import { SpinnerService } from './share-module/spinner/spinner.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'carTS';
  currentUser: any = null;
  isModalVisible$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: RegisterLoginService,
    private spinner: SpinnerService,
  ) {
    this.authService.currentUser$.subscribe((res) => {
      this.currentUser = res;
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.authService.currentUserSubject$.next(null);
  }

  showLoginModal(): void {
    this.isModalVisible$.next(true);
  }

  handleCancel(): void {
    this.isModalVisible$.next(false);
  }
}
