import { Component } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { List } from '../../models/list.model';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent {
  lists: List[] = []; 
  tasks: any[] | null = null; 
  selectedListId: string | null = null;

  constructor(
    private taskService: TaskService, 
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const listId = params['listId'];
      
      if (!listId) {
        this.tasks = null;
        return;
      }

      this.selectedListId = listId;
      this.taskService.getTasks(listId).subscribe({
        next: (tasks: any[]) => this.tasks = tasks,
        error: (error: Error) => console.error('Error fetching tasks:', error)
      });
    });

    this.taskService.getLists().subscribe({
      next: (lists: any[]) => this.lists = lists,
      error: (error: Error) => console.error('Error fetching lists:', error)
    });
  }

  onTaskClick(task: any) {
    this.taskService.complete(task).subscribe({
      next: () => task.completed = !task.completed,
      error: (error: Error) => console.error('Error updating task:', error)
    });
  }
}