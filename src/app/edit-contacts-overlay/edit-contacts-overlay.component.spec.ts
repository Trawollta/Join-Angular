import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactsOverlayComponent } from './edit-contacts-overlay.component';

describe('EditContactsOverlayComponent', () => {
  let component: EditContactsOverlayComponent;
  let fixture: ComponentFixture<EditContactsOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContactsOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditContactsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
