import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubphaselistComponent } from './subphaselist.component';

describe('SubphaselistComponent', () => {
  let component: SubphaselistComponent;
  let fixture: ComponentFixture<SubphaselistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubphaselistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubphaselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
