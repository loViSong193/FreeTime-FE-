import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../car-interface/car-interface';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  apiUrl = 'http://localhost:3000/cars'

  constructor(private http: HttpClient) { }

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl)
  }

  createCar(body: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, body)
  }
  
}
