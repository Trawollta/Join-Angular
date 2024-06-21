import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactsDialogComponent } from './edit-contacts-dialog.component';

describe('EditContactsDialogComponent', () => {
  let component: EditContactsDialogComponent;
  let fixture: ComponentFixture<EditContactsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContactsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditContactsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
