import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRunModalComponent } from './edit-run-modal.component';

describe('AddRunComponent', () => {
  let component: EditRunModalComponent;
  let fixture: ComponentFixture<EditRunModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRunModalComponent]
    });
    fixture = TestBed.createComponent(EditRunModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
