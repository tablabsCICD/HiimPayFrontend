import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEmployeeComponent } from './client-employee.component';

describe('ClientEmployeeComponent', () => {
  let component: ClientEmployeeComponent;
  let fixture: ComponentFixture<ClientEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
