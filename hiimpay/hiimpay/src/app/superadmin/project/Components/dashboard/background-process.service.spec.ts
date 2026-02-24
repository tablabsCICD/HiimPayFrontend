import { TestBed } from '@angular/core/testing';

import { BackgroundProcessService } from './background-process.service';

describe('BackgroundProcessService', () => {
  let service: BackgroundProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
