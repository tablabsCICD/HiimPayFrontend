import { TestBed } from '@angular/core/testing';

import { SearchuserService } from './searchuser.service';

describe('SearchuserService', () => {
  let service: SearchuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
