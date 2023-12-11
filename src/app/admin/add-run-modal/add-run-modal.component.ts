import {Component, inject} from '@angular/core';
import {
  NgbActiveModal,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-add-run-modal',
  templateUrl: './add-run-modal.component.html',
  styleUrls: ['./add-run-modal.component.scss']
})
export class AddRunModalComponent {
  activeModal = inject(NgbActiveModal);
  error: string;
  loading = false;
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 7);

  constructor(
    private adminService: AdminService
  ) {
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  onSubmit() {
    if (this.fromDate && this.toDate) {
      this.adminService.createRun(this.formatter.format(this.fromDate), this.formatter.format(this.toDate))
        .subscribe(
          () => this.activeModal.close('CONFIRM')
        );
    }
    return;
  }

  back() {
    this.activeModal.close('CANCEL');
  }
}
