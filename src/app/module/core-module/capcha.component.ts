import { Component, EventEmitter, Output, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-captcha',
  template: `<div id="captcha-container"></div>`,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class CaptchaComponent implements AfterViewInit {
  @Output() resolved = new EventEmitter<string>();
  private widgetId: number | null = null;

  ngAfterViewInit() {
    this.renderCaptcha()
  }
  
  private renderCaptcha() {
    if (typeof (window as any).grecaptcha === 'undefined') {
      setTimeout(() => this.renderCaptcha(), 200);
      return;
    }
    this.widgetId = (window as any).grecaptcha.render('captcha-container', {
      sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
      callback: (token: string) => this.resolved.emit(token),
      'expired-callback': () => this.resolved.emit(''),
    });
  }

  resetCaptcha() {
    if (this.widgetId !== null) {
      (window as any).grecaptcha.reset(this.widgetId);
      this.resolved.emit('');
    }
  }
}
