import {Component, inject} from '@angular/core';
import {
  NgbActiveModal,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter, NgbInputDatepicker
} from '@ng-bootstrap/ng-bootstrap';
import {AdminService} from "../../services/admin.service";
import {Run} from "../../models/run.model";

@Component({
  selector: 'app-edit-run-modal',
  templateUrl: './edit-run-modal.component.html',
  styleUrls: ['./edit-run-modal.component.scss']
})
export class EditRunModalComponent {
  run: Run;
  activeModal = inject(NgbActiveModal);
  error: string;
  loading = false;
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);
  toDate: NgbDate | null;

  constructor(
    private adminService: AdminService
  ) {
  }

  ngOnInit() {
    this.toDate = NgbDate.from(this.formatter.parse(this.run.endDate));
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  toggle(dp: NgbInputDatepicker) {
    if (!dp.isOpen()) {
      dp.manualDateChange(this.formatter.format(this.toDate));
    }
    dp.toggle();
  }

  onSubmit() {
    this.loading = true;
    if (this.toDate) {
      this.adminService.editRun(this.run.id, this.formatter.format(this.toDate))
        .subscribe(
          () => {
            this.loading = false;
            this.activeModal.close('CONFIRM');
          }
        );
    }
    return;
  }

  back() {
    this.activeModal.close('CANCEL');
  }
}
