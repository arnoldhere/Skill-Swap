import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCategoryComponent } from './skill-category.component';

describe('SkillCategoryComponent', () => {
  let component: SkillCategoryComponent;
  let fixture: ComponentFixture<SkillCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
