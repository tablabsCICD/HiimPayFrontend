import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupquestionListComponent } from './supquestion-list.component';

describe('SupquestionListComponent', () => {
  let component: SupquestionListComponent;
  let fixture: ComponentFixture<SupquestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupquestionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupquestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
