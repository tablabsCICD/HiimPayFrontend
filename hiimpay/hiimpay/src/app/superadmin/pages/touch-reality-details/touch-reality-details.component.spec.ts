import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchRealityDetailsComponent } from './touch-reality-details.component';

describe('TouchRealityDetailsComponent', () => {
  let component: TouchRealityDetailsComponent;
  let fixture: ComponentFixture<TouchRealityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouchRealityDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TouchRealityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
