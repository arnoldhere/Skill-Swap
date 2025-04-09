import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5000';
  constructor(private http: HttpClient) { }
  /********  Auth Service ********/
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
  /*******************   api Services & routes   ****************************/

  // 🎯 Get Logged-in Admin Profile
  getAdminProfile(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/get-profile/${id}`);
  }

  getSkillsCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/get-skills-category`);
  }

  addSkillCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add-skills-category`, data);
  }

  deleteSkillCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/delete-skills-category/${id}`);
  }

  // Fetch category by ID
  getSkillCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/get-skill-category/${id}`);
  }

  updateSkillCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/update-skills-category/${id}`, data);
  }

  addAdmin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add-admin`, data);
  }

  // 💾 Update Admin Profile
  updateAdminProfile(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/update-profile/${id}`, updatedData);
  }

  // 📊 Get All Admin users
  getAdminUsers(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/get-admins/${id}`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/get-users`);
  }

  getFeedbackRating(): Observable<any> {
    return this.http.get(`${this.apiUrl}/others/get-feedbacks-rating`);
  }

  saveFeedback(id: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/others/save-feedback/${id}`, data);
  }

  // ✅ Get user by ID
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/others/get-user/${userId}`)
  }

  // ✅ Get logged-in user ID (if stored in localStorage or decoded from token)
  getUserId(): string {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData)._id : '';
  }

  uploadSkill(data: any, id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/add-skills/${id}`, data);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/others/get-all-users`);
  }

  getCurrentUser(id: string): Observable<any> {
    console.log(id)
    return this.http.get(`${this.apiUrl}/user/get-current-user/${id}`);
  }
  updateUser(id: string, user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/update-current-user/${id}`, { user });
  }

  getStates() {
    return this.http.get(`${this.apiUrl}/others/states`);
  }

  getCitiesByState(stateName: string) {
    return this.http.get(`${this.apiUrl}/others/cities/${stateName}`); // API to get cities of selected state
  }

  updateAvailabilityStatus(id: string, email: string, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/update-user-avail-status/${id}`, { email });
  }

  uploadProfilePhoto(file: File, id: string): Observable<any> {
    const formData = new FormData();
    formData.append('profilephoto', file);
    return this.http.post<any>(`${this.apiUrl}/user/user-profile-image/${id}`, formData);
  }

  updateUserBio(id: string, bio: string): Observable<any> {
    // const formData = new FormData();
    // formData.append("bio", bio);
    console.log(bio)
    return this.http.post<any>(`${this.apiUrl}/user/update-bio/${id}`, bio);
  };

  fetchSkillsCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/others/get-skills-category`);
  }

  /********  Other Services  ********/
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
