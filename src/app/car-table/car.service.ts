import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Car, CarRespond, PagingInfo } from './car-interface/car-interface';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = 'http://localhost:3000/cars';

  private carsSubject = new BehaviorSubject<Car[]>([]);
  private pagingSubject = new BehaviorSubject<PagingInfo>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private searchSubject = new BehaviorSubject<string>('');

  cars$ = this.carsSubject.asObservable();
  paging$ = this.pagingSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadCars(): Observable<CarRespond> {
    const { page, pageSize } = this.pagingSubject.value;
    const keyword = this.searchSubject.value;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (keyword) {
      params = params.set('keyword', keyword);
    }

    this.loadingSubject.next(true);

    return this.http.get<CarRespond>(this.apiUrl, { params }).pipe(
      tap({
        next: (res) => {
          this.carsSubject.next(res.items);
          this.pagingSubject.next({
            page: res.pagingInfo.page,
            pageSize: res.pagingInfo.pageSize,
            totalItems: res.pagingInfo.totalItems,
          });
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false),
      })
    );
  }

  search(keyword: string): void {
    this.searchSubject.next(keyword);
    const paging = this.pagingSubject.value;
    this.pagingSubject.next({ ...paging, page: 1 });
  }

  setPage(page: number): void {
    const paging = this.pagingSubject.value;
    this.pagingSubject.next({ ...paging, page });
  }

  setPageSize(pageSize: number): void {
    this.pagingSubject.next({
      page: 1,
      pageSize,
      totalItems: this.pagingSubject.value.totalItems,
    });
  }

  createCar(body: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, body).pipe(
      tap((newCar) => {
        this.carsSubject.next([...this.carsSubject.value, newCar]);
        const paging = this.pagingSubject.value;
        this.pagingSubject.next({ ...paging, totalItems: paging.totalItems + 1 });
      })
    );
  }

  updateCar(id: string, body: Car): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, body).pipe(
      tap((updated) => {
        this.carsSubject.next(
          this.carsSubject.value.map((c) => (c._id === id ? updated : c))
        );
      })
    );
  }

  deleteCar(id: string): Observable<Car> {
    return this.http.delete<Car>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.carsSubject.next(
          this.carsSubject.value.filter((c) => c._id !== id)
        );
        const paging = this.pagingSubject.value;
        this.pagingSubject.next({ ...paging, totalItems: paging.totalItems - 1 });
      })
    );
  }

  exportWord(ids: string[]): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/export`,
      { ids },
      { responseType: 'blob' }
    );
  }
}
