import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusgroupComponent } from './focusgroup.component';

describe('FocusgroupComponent', () => {
  let component: FocusgroupComponent;
  let fixture: ComponentFixture<FocusgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FocusgroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FocusgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
