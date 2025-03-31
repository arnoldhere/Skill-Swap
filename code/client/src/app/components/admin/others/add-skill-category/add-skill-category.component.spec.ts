import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillCategoryComponent } from './add-skill-category.component';

describe('AddSkillCategoryComponent', () => {
  let component: AddSkillCategoryComponent;
  let fixture: ComponentFixture<AddSkillCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSkillCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSkillCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
