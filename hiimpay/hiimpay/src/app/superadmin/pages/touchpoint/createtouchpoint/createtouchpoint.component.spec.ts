import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatetouchpointComponent } from './createtouchpoint.component';

describe('CreatetouchpointComponent', () => {
  let component: CreatetouchpointComponent;
  let fixture: ComponentFixture<CreatetouchpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatetouchpointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatetouchpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
