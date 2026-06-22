import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterLoginService {
  private apiUrl = 'http://localhost:3000/auth'; // Adjust port if needed
  public currentUserSubject$ = new BehaviorSubject<any>(null);

  public currentUser$ = this.currentUserSubject$.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject$.next(JSON.parse(savedUser));
    }
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}
