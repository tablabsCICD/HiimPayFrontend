import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmoreTouchRealityComponent } from './addmore-touch-reality.component';

describe('AddmoreTouchRealityComponent', () => {
  let component: AddmoreTouchRealityComponent;
  let fixture: ComponentFixture<AddmoreTouchRealityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddmoreTouchRealityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddmoreTouchRealityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
