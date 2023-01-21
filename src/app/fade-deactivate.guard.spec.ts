import { TestBed } from '@angular/core/testing';

import { FadeDeactivateGuard } from './fade-deactivate.guard';

describe('FadeDeactivateGuard', () => {
  let guard: FadeDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FadeDeactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
