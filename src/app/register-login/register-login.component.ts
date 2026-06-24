import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterLoginService } from './register-login.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CaptchaComponent } from '../module/core-module/capcha.component';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.scss'],
})
export class RegisterLoginComponent implements OnInit {
  validateForm!: FormGroup;
  isLogin = true;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild(CaptchaComponent) captchaComponent!: CaptchaComponent;
  captchaToken: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: RegisterLoginService,
    private message: NzMessageService,
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
            this.closeModal.emit();
            console.log('Login success:', res);
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.authService.currentUserSubject$.next(res.user);
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
