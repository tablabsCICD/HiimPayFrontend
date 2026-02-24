import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusgroupEditComponent } from './focusgroup-edit.component';

describe('FocusgroupEditComponent', () => {
  let component: FocusgroupEditComponent;
  let fixture: ComponentFixture<FocusgroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FocusgroupEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FocusgroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
