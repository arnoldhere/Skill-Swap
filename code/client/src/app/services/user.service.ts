import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/Signup`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/Login`, credentials);
  }

  // Method to initiate Google login
  loginWithGoogle(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Auth/Google/Success`);
  }

  forgetPassword(email: string): Observable<any> {
    // console.log(`${this.apiUrl}/Forget-password`)
    return this.http.post(`${this.apiUrl}/Auth/Forget-password`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/Verify-otp`, { email, otp });
  }

  changePassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/Change-password`, { email, newPassword });
  }
/*******************   USER ROUTES   ****************************/
  getCurrentUser(id: string): Observable<any> {
    console.log(id)
    return this.http.get(`${this.apiUrl}/user/get-current-user/${id}`);
  }

  updateUser(id: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/update-current-user/${id}`, { email });
  }

  updateAvailabilityStatus(id: string, email: string, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/update-user-avail-status/${id}`, { email });
  }


  storeUserData(token: string, firstname: string, lastname: string, role: string, id: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('firstname', firstname);
    localStorage.setItem('lastname', lastname);
    localStorage.setItem('id', id);
    localStorage.setItem('role', role);
  }
  // Additional methods for authentication state
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Ensures token exists
  }

  logout(): void {
    localStorage.clear();
  }
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
