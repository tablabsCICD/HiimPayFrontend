import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartefficiencyComponent } from './startefficiency.component';

describe('StartefficiencyComponent', () => {
  let component: StartefficiencyComponent;
  let fixture: ComponentFixture<StartefficiencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartefficiencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartefficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
