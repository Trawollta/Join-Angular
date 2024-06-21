import { TestBed } from '@angular/core/testing';

import { AddTaskService } from './add-tasks.service';

describe('AddTasksService', () => {
  let service: AddTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
