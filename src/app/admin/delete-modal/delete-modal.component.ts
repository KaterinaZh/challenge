import {Component, inject} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AdminService} from "../../services/admin.service";
import {Run} from "../../models/run.model";
import {Task} from "../../models/task.model";

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent {
  run: Run;
  task: Task;
  activeModal = inject(NgbActiveModal);
  loading: boolean;

  constructor(
    private adminService: AdminService
  ) {
  }

  delete() {
    this.loading = true;
    if (this.run) {
      this.adminService.deleteRun(this.run.id)
        .subscribe(
          () => {
            this.loading = false;
            this.activeModal.close('CONFIRM');
          }
        );
    } else {
      this.adminService.deleteTask(this.task.id)
        .subscribe(
          () => {
            this.loading = false;
            this.activeModal.close('CONFIRM');
          }
        );
    }
  }

  back() {
    this.activeModal.close('CANCEL');
  }
}
