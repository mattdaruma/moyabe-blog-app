import { TestBed } from '@angular/core/testing';

import { MoyabeBlogService } from './moyabe-blog.service';

describe('MoyabeBlogService', () => {
  let service: MoyabeBlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoyabeBlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
