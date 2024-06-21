import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactsDialogComponent } from './add-contacts-dialog.component';

describe('AddContactsDialogComponent', () => {
  let component: AddContactsDialogComponent;
  let fixture: ComponentFixture<AddContactsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContactsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddContactsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
