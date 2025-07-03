import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Worklogs } from './worklogs';

describe('Worklogs', () => {
  let component: Worklogs;
  let fixture: ComponentFixture<Worklogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Worklogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Worklogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
