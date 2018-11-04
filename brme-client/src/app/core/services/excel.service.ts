import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {Excel, ExcelDTO} from '../../settings/models/excel.model';
import {map, switchMap} from 'rxjs/operators';

@Injectable()
export class ExcelService {
  constructor (private http: HttpClient) {}

  public upload(excel: Excel): Observable<ExcelDTO> {
    const formData: FormData = new FormData();
    formData.append('file', excel.file);
    formData.append('filename', excel.filename);
    const url = `${environment.upiUrl}/media_objects`;
    return this.http.post<ExcelDTO>(url,  formData);
  }

  public parse(id: number, add: number): Observable<any> {
    console.log(id);
    const url = `${environment.upiUrl}/parse_excel/${id}/${add}`;
    return this.http.get(url).pipe(map((array: string) => JSON.parse(array)));
  }

  public delete(id: number): Observable<any> {
    const url = `${environment.upiUrl}/media_objects/${id}`;
    return this.http.delete(url);
  }

  public setPwd(ids: number[]) {
    if (ids.length > 0) {
      // console.log(ids.length);
      // console.log(ids);
      const url = `${environment.upiUrl}/setnewpwd`;
      const id20 = ids.splice(0, 20);
      return this.http.post(url, id20).pipe(switchMap(sucess => this.setPwd(ids)));
    } else {
      const url = `${environment.upiUrl}/clean`;
      return this.http.get(url);
    }
  }
}
