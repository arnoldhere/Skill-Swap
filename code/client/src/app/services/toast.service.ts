import { Injectable } from '@angular/core';
import { ToastService } from 'angular-toastify';

@Injectable({
  providedIn: 'root'
})
export class CustomToastService {

  constructor(private toastService: ToastService) { }

  success(message: string) {
    this.toastService.success(message);
  }

  error(message: string) {
    this.toastService.error(message);
  }

  info(message: string) {
    this.toastService.info(message);
  }

  warning(message: string) {
    this.toastService.warn(message);
  }
}
