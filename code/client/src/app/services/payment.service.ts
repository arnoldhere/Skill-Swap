import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) { }

  private apiUrl = "http://localhost:5000"

  createOrder(amount: number, currency: string = 'INR') {
    return this.http.post<any>(`${this.apiUrl}/payment/create-order`, { amount, currency });
  }
}
