import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRunModalComponent } from './add-run-modal.component';

describe('AddRunComponent', () => {
  let component: AddRunModalComponent;
  let fixture: ComponentFixture<AddRunModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRunModalComponent]
    });
    fixture = TestBed.createComponent(AddRunModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
