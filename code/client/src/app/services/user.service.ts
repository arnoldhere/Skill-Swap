import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5000/Auth';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Signup`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, credentials);
  }

  // Method to initiate Google login
  loginWithGoogle(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Google/Success`);
  }

  forgetPassword(email: string): Observable<any> {
    console.log(`${this.apiUrl}/Forget-password`)
    return this.http.post(`${this.apiUrl}/Forget-password`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Verify-otp`, { email, otp });
  }

  changePassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Change-password`, { email, newPassword });
  }

  storeUserData(token: string, firstname: string, lastname: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('firstname', firstname);
    localStorage.setItem('lastname', lastname);
  }
  // Additional methods for authentication state
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
