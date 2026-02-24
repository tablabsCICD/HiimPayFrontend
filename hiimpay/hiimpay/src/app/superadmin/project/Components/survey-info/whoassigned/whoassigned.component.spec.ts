import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoassignedComponent } from './whoassigned.component';

describe('WhoassignedComponent', () => {
  let component: WhoassignedComponent;
  let fixture: ComponentFixture<WhoassignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhoassignedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhoassignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
