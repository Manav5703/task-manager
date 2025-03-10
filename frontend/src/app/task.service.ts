import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private webReqService: WebRequestService) { }

  getLists(): Observable<any[]> {
    return this.webReqService.get('lists') as Observable<any[]>;
  }
  
  createList(title: string): Observable<any> {
    return this.webReqService.post('lists', { title });
  }
  
  getTasks(listId: string): Observable<any[]> {
    return this.webReqService.get(`lists/${listId}/tasks`) as Observable<any[]>;
  }

  createTask(title: string, listId: string): Observable<any> {
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, 
    {
      completed: !task.completed
    });
  }
}