import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCheckInOut } from './employee-check-in-out';

describe('EmployeeCheckInOut', () => {
  let component: EmployeeCheckInOut;
  let fixture: ComponentFixture<EmployeeCheckInOut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCheckInOut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCheckInOut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
