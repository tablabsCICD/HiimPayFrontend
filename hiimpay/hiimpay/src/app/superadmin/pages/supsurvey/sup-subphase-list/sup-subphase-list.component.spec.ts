import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupSubphaseListComponent } from './sup-subphase-list.component';

describe('SupSubphaseListComponent', () => {
  let component: SupSubphaseListComponent;
  let fixture: ComponentFixture<SupSubphaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupSubphaseListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupSubphaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
