import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpswComponent } from './forgotpsw.component';

describe('ForgotpswComponent', () => {
  let component: ForgotpswComponent;
  let fixture: ComponentFixture<ForgotpswComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotpswComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotpswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
