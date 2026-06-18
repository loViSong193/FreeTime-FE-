import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car, CarRespond, Paging } from '../car-interface/car-interface';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  apiUrl = 'http://localhost:3000/cars';

  constructor(private http: HttpClient) {}

  getAllCars(paging: Paging, search?: any): Observable<CarRespond> {
    let params = new HttpParams()
    .set('page', paging.page.toString())
    .set('pageSize', paging.pageSize.toString())

    if(search) {
      params = params.set('keyword', search)
    }
    return this.http.get<CarRespond>(this.apiUrl, { params });
  }

  createCar(body: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, body);
  }

  updateCar(id: string, body: Car): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, body);
  }

  deleteCar(id: string): Observable<Car> {
    return this.http.delete<Car>(`${this.apiUrl}/${id}`);
  }  

  exportWord(ids: string[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, { ids }, { responseType: 'blob' });
  }
}
