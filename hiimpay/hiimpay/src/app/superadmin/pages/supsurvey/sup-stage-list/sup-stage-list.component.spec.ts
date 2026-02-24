import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupStageListComponent } from './sup-stage-list.component';

describe('SupStageListComponent', () => {
  let component: SupStageListComponent;
  let fixture: ComponentFixture<SupStageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupStageListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupStageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
