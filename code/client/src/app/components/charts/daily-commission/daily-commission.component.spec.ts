import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCommissionComponent } from './daily-commission.component';

describe('DailyCommissionComponent', () => {
  let component: DailyCommissionComponent;
  let fixture: ComponentFixture<DailyCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyCommissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
