import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillCategoryComponent } from './edit-skill-category.component';

describe('EditSkillCategoryComponent', () => {
  let component: EditSkillCategoryComponent;
  let fixture: ComponentFixture<EditSkillCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSkillCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSkillCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
