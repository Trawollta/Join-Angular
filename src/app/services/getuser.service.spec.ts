import { TestBed } from '@angular/core/testing';
import { GetUserService } from './getuser.service'; // Korrigierter Dienstname

describe('GetUserService', () => { // Korrigierter Dienstname
  let service: GetUserService; // Korrigierter Dienstname

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUserService); // Korrigierter Dienstname
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
