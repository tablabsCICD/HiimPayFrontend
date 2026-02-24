import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyListByClientComponent } from './survey-list-by-client.component';

describe('SurveyListByClientComponent', () => {
  let component: SurveyListByClientComponent;
  let fixture: ComponentFixture<SurveyListByClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyListByClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyListByClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
