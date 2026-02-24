import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchpointComponent } from './touchpoint.component';

describe('TouchpointComponent', () => {
  let component: TouchpointComponent;
  let fixture: ComponentFixture<TouchpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouchpointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TouchpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
