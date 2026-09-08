import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { UserOutline, LockOutline } from '@ant-design/icons-angular/icons';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/core/auth.interceptor';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: NZ_ICONS, useValue: [UserOutline, LockOutline] },
    { provide: NZ_I18N, useValue: en_US },
    importProvidersFrom(NgxSpinnerModule.forRoot()),
  ]
}).catch(err => console.error(err));
