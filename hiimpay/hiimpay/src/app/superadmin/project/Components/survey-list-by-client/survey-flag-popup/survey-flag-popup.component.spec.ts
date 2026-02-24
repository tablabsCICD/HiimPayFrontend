import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyFlagPopupComponent } from './survey-flag-popup.component';

describe('SurveyFlagPopupComponent', () => {
  let component: SurveyFlagPopupComponent;
  let fixture: ComponentFixture<SurveyFlagPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyFlagPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyFlagPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
