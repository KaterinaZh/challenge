import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Run} from "../models/run.model";


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() options: Run[];
  @Output() chooseEvent: EventEmitter<Run> = new EventEmitter<Run>();
  public chosenValue: string;
  public toggle: boolean = false;
  @ViewChild('dropdown') dropdown: ElementRef;

  public ngOnInit() {
    if (this.options?.length > 0) {
      this.chosenValue = this.options[this.options.length - 1].description;
    }
  }

  public openDropdown() {
    this.toggle = !this.toggle;
  }

  public chooseItem(item: Run) {
    this.toggle = false;
    this.chosenValue = item.description;
    this.chooseEvent.emit(item);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.dropdown.nativeElement.contains(event.target)) {
      this.toggle = false;
    }
  }
}
