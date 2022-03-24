import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GeoJsonService {
 constructor(private http: HttpClient) { }
  getGeoJson(geoJsonUrl: string) {
   return this.http.get(geoJsonUrl);
 }


}
