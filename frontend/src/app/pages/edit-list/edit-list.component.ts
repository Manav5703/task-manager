import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../task.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-list',
  imports: [RouterLink],
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.scss'
})
export class EditListComponent {
  listId: string = '';

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.listId = params['listId'];
    });
  }

  updateList(title: string) {
    this.taskService.updateList(this.listId, title).subscribe({
      next: (res) => {
        console.log('List edited successfully:', res);
        this.router.navigate(['/lists']);
        // Show success notification
        this.showNotification('List edited successfully');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating list:', error);
        // Show error notification
        this.showNotification('Error updating list. Please try again.', true);
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
