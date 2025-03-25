import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBioSectionComponent } from './edit-bio-section.component';

describe('EditBioSectionComponent', () => {
  let component: EditBioSectionComponent;
  let fixture: ComponentFixture<EditBioSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBioSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBioSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
