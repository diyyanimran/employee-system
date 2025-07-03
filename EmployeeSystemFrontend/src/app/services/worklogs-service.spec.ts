import { TestBed } from '@angular/core/testing';

import { WorklogsService } from './worklogs-service';

describe('WorklogsService', () => {
  let service: WorklogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorklogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
