import { Component } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-new-task',
  imports: [RouterLink],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent {

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  listId!: string;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId']; 
      console.log('Route params:', params);
    });
  }

  createTask(title: string) {
    this.taskService.createTask(title, this.listId).subscribe((newTask: Task) => {
      this.router.navigate(['../'], { relativeTo: this.route});
    }); 
  }

}
