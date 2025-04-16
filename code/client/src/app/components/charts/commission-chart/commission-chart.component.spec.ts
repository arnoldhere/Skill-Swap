import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionChartComponent } from './commission-chart.component';

describe('CommissionChartComponent', () => {
  let component: CommissionChartComponent;
  let fixture: ComponentFixture<CommissionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
