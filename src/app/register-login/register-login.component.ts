import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterLoginService } from './register-login.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CaptchaComponent } from '../core/capcha.component';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzGridModule, NzCheckboxModule, NzButtonModule, NzMessageModule, NzIconModule, CaptchaComponent],
})
export class RegisterLoginComponent implements OnInit {
  validateForm!: FormGroup;
  isLogin = true;
  @ViewChild(CaptchaComponent) captchaComponent!: CaptchaComponent;
  captchaToken: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: RegisterLoginService,
    private message: NzMessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  onCaptchaResolved(token: string) {
    this.captchaToken = token;
  }

  initForm() {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true], // Optional field for login
    });
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.validateForm.reset();
    this.captchaToken = '';
    if (!this.isLogin) {
      this.captchaComponent?.resetCaptcha();
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { email, password } = this.validateForm.value;

      if (this.isLogin) {
        if (!this.captchaToken) {
          this.message.warning('Vui lòng xác nhận captcha!');
          return;
        }
        this.authService.login({ email, password, captchaToken: this.captchaToken }).subscribe({
          next: (res) => {
            this.message.success('Đăng nhập thành công!');
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.authService.currentUserSubject$.next(res.user);
            this.router.navigate(['/cars']);
          },
          error: (err) => {
            this.message.error('Đăng nhập thất bại!');
            this.captchaComponent?.resetCaptcha();
            console.error(err);
          },
        });
      } else {
        this.authService.register({ email, password }).subscribe({
          next: (res) => {
            this.message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            this.isLogin = true;
          },
          error: (err) => {
            this.message.error('Đăng ký thất bại!');
            console.error(err);
          },
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
