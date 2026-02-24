import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationExComponent } from './communication-ex.component';

describe('CommunicationExComponent', () => {
  let component: CommunicationExComponent;
  let fixture: ComponentFixture<CommunicationExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunicationExComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunicationExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
