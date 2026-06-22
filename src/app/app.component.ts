import { Component } from '@angular/core';
import { RegisterLoginService } from './register-login/register-login.service';
import { SpinnerService } from './share-module/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'carTS';
  currentUser: any = null;
  isModalVisible = false;

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
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }
}
