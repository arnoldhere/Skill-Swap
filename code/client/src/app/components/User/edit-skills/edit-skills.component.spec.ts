import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillsComponent } from './edit-skills.component';

describe('EditSkillsComponent', () => {
  let component: EditSkillsComponent;
  let fixture: ComponentFixture<EditSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSkillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
