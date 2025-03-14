import { Component } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { List } from '../../models/list.model';
import { AuthService } from '../../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  selectedListId: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private taskService: TaskService, 
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.errorMessage = '';
    
    this.route.params.subscribe(params => {
      const listId = params['listId'];
      
      if (!listId) {
        this.tasks = null;
        return;
      }

      this.selectedListId = listId;
      this.taskService.getTasks(listId).subscribe({
        next: (tasks: any[]) => {
          this.tasks = tasks;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.handleError(error, 'tasks');
        }
      });
    });

    this.taskService.getLists().subscribe({
      next: (lists: any[]) => {
        this.lists = lists;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.handleError(error, 'lists');
      }
    });
  }

  onTaskClick(task: any) {
    this.taskService.complete(task).subscribe({
      next: () => task.completed = !task.completed,
      error: (error: HttpErrorResponse) => {
        this.handleError(error, 'task update');
      }
    });
  }

  onLogoutClick() {
    console.log('Logging out user');
    this.authService.logout();
    // The logout method in AuthService already handles the navigation to login page
  }

  private handleError(error: HttpErrorResponse, context: string) {
    console.error(`Error fetching ${context}:`, error);
    
    if (error.status === 401) {
      this.errorMessage = 'Your session has expired. Please log in again.';
      // Show error notification
      this.showNotification('Your session has expired. Please log in again.', true);
      
      // Explicitly navigate to login page after a short delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500); // Short delay to allow user to see the message
    } else {
      this.errorMessage = `An error occurred while loading ${context}. Please try again later.`;
      // Show error notification
      this.showNotification(`An error occurred while loading ${context}. Please try again later.`, true);
    }
  }

  onDeleteListClick() {
    if (!this.selectedListId) {
      console.error('No list selected for deletion');
      this.errorMessage = 'Please select a list to delete.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.taskService.deleteList(this.selectedListId).subscribe({
      next: (res: any) => {
        console.log('List deleted successfully:', res);
        
        // Remove the deleted list from the lists array
        this.lists = this.lists.filter(list => list._id !== this.selectedListId);
        
        // Navigate back to lists
        this.router.navigate(['/lists']);
        this.loading = false;
        
        // Show success notification
        this.showNotification('List deleted successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Error deleting list:', error);
        this.handleError(error, 'list deletion');
      }
    });
  }

  onDeleteTaskClick(id: string, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    
    if (!this.selectedListId) {
      console.error('No task selected for deletion');
      this.errorMessage = 'Please select a task to delete.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.taskService.deleteTask(this.selectedListId, id).subscribe({
      next: (res: any) => {
        console.log('Task deleted successfully:', res);
       
        // Remove the deleted task from the tasks array
        if (this.tasks) {
          this.tasks = this.tasks.filter(val => val._id !== id);
        }
        
        this.loading = false;
        
        // Show success notification
        this.showNotification('Task deleted successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Error deleting task:', error);
        this.handleError(error, 'task deletion');
      }
    });
  }
  
  // Updated notification method to handle errors
  private showNotification(message: string, isError: boolean = false) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    if (isError) {
      notification.classList.add('error');
    }
    notification.textContent = message;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300); // Wait for fade out animation
    }, 3000);
  }
}