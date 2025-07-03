import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWorklogs } from './employee-worklogs';

describe('EmployeeWorklogs', () => {
  let component: EmployeeWorklogs;
  let fixture: ComponentFixture<EmployeeWorklogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeWorklogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeWorklogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
