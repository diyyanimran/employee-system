import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessage } from '../DTOs/message';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  getMessages(ids: any): Observable<IMessage[]>
  {
    return this.http.post<IMessage[]>(API_ENDPOINTS.getMessages, ids);
  }

  sendMessage(message: any): Observable<void>
  {
    console.log("Sending from service: ", message);
    return this.http.post<void>(API_ENDPOINTS.sendMessage, message);
  }
}
