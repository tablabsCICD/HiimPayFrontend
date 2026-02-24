import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarttouchpointComponent } from './starttouchpoint.component';

describe('StarttouchpointComponent', () => {
  let component: StarttouchpointComponent;
  let fixture: ComponentFixture<StarttouchpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarttouchpointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StarttouchpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
