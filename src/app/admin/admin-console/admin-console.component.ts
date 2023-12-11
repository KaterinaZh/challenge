import {Component, inject, OnInit} from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {Router} from "@angular/router";
import {Run} from "../../models/run.model";
import {Task} from "../../models/task.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeleteModalComponent} from "../delete-modal/delete-modal.component";
import {forkJoin} from "rxjs";
import {AddRunModalComponent} from "../add-run-modal/add-run-modal.component";
import {EditRunModalComponent} from "../edit-run-modal/edit-run-modal.component";

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss']
})
export class AdminConsoleComponent implements OnInit {
  public isLoading = false;
  public runs: Run[] = [];
  public currentRun: Run;
  public newTaskIdVisible: boolean = false;
  public newTaskId: string;
  public newTaskErr: string;
  public newTaskPoints: number;
  private modalService = inject(NgbModal);

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.redirectToAdminLogin();
  }

  logout() {
    this.adminService.logout();
    this.redirectToAdminLogin();
  }

  back() {
    this.router.navigate(['/']);
  }

  public chooseRun(run: Run) {
    this.currentRun = run;
  }

  public deleteRun() {
    const modalRef = this.modalService.open(DeleteModalComponent,
      {centered: true, backdrop: 'static'});
    modalRef.componentInstance.run = this.currentRun;
    modalRef.closed.subscribe(res => {
      if (res === 'CONFIRM') {
        this.initRunList();
      }
    });
  }

  public editRun() {
    const modalRef = this.modalService.open(EditRunModalComponent,
      {centered: true, backdrop: 'static'});
    modalRef.componentInstance.run = this.currentRun;
    modalRef.closed.subscribe(res => {
      if (res === 'CONFIRM') {
        this.initRunList();
      }
    });
  }

  public openNewRunForm() {
    const modalRef = this.modalService
      .open(AddRunModalComponent, {centered: true, backdrop: 'static'});
    modalRef.closed.subscribe(res => {
      if (res === 'CONFIRM') {
        this.initRunList();
      }
    });
  }

  public createTask() {
    this.newTaskErr = '';
    this.adminService.createTask(this.newTaskId, this.currentRun.id, this.newTaskPoints)
      .subscribe({
        next: () => {
          this.newTaskPoints = 0;
          this.newTaskId = '';
          this.newTaskIdVisible = false;
          this.initRunList();
        },
        error: error => {
          if (error.error && error.error.message) {
            this.newTaskErr = error.error.message;
          } else {
            this.newTaskErr = 'Error';
            console.error(error);
          }
        }
      });
  }

  public deleteTask(task: Task) {
    const modalRef = this.modalService.open(DeleteModalComponent, {centered: true, backdrop: 'static'});
    modalRef.componentInstance.task = task;
    modalRef.closed.subscribe(res => {
      if (res === 'CONFIRM') {
        this.initRunList();
      }
    });
  }

  private redirectToAdminLogin() {
    if (!this.adminService.isLoggedIn()) {
      this.router.navigate(['/admin-login']);
    } else {
      this.initRunList();
    }
  }

  private initRunList() {
    this.isLoading = true;
    const runs$ = this.adminService.getRunList();
    const tasks$ = this.adminService.getTasks();

    forkJoin([runs$, tasks$]).subscribe((res: [runs: Run[], tasks: Task[]]) => {
      this.runs = res[0];
      // TODO: add tasks to specific run
      // this.runs.forEach(run => run.tasks = res[1]);
      if (this.runs.length > 0) {
        this.currentRun = this.runs[this.runs.length - 1];
        this.currentRun.tasks = res[1].map((task, index) => {
          // TODO: get points from server
          task.points = 5 * (index + 1);
          return task
        });
      }
      this.isLoading = false;
    });
  }
}
