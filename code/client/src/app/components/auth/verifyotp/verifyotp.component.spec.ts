import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyotpComponent } from './verifyotp.component';

describe('VerifyotpComponent', () => {
  let component: VerifyotpComponent;
  let fixture: ComponentFixture<VerifyotpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyotpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
