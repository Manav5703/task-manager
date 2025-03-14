import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-edit-task',
  imports: [RouterLink],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent {
  listId: string = '';
  taskId: string = '';

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.taskId = params['taskId'];
      this.listId = params['listId'];
    });
  }

  updateTask(title: string) {
    this.taskService.updateTask(this.listId, this.taskId, title).subscribe({
      next: (res) => {
        console.log('Task edited successfully:', res);
        this.router.navigate(['/lists', this.listId]);
        // Show success notification
        this.showNotification('Task edited successfully');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating task:', error);
        // Show error notification
        this.showNotification('Error updating task. Please try again.', true);
      }
    });
  }

  // Notification method to handle success and errors
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
