import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagelistComponent } from './stagelist.component';

describe('StagelistComponent', () => {
  let component: StagelistComponent;
  let fixture: ComponentFixture<StagelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StagelistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StagelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
