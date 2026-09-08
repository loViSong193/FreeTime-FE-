import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RegisterLoginService } from './register-login/register-login.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NzButtonModule, SpinnerComponent]
})
export class AppComponent {
  title = 'carTS';
  currentUser: any = null;

  constructor(
    private authService: RegisterLoginService,
    private router: Router,
  ) {
    this.authService.currentUser$.subscribe((res) => {
      this.currentUser = res;
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authService.currentUserSubject$.next(null);
    this.router.navigate(['/login']);
  }
}
