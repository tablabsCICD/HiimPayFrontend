import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyIndetailsComponent } from './survey-indetails.component';

describe('SurveyIndetailsComponent', () => {
  let component: SurveyIndetailsComponent;
  let fixture: ComponentFixture<SurveyIndetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyIndetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyIndetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
