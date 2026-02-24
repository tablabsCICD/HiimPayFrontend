import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExMeetingsComponent } from './ex-meetings.component';

describe('ExMeetingsComponent', () => {
  let component: ExMeetingsComponent;
  let fixture: ComponentFixture<ExMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExMeetingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
