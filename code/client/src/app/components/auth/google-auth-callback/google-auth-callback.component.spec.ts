import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAuthCallbackComponent } from './google-auth-callback.component';

describe('GoogleAuthCallbackComponent', () => {
  let component: GoogleAuthCallbackComponent;
  let fixture: ComponentFixture<GoogleAuthCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleAuthCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleAuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
