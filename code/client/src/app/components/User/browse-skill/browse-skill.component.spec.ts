import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseSkillComponent } from './browse-skill.component';

describe('BrowseSkillComponent', () => {
  let component: BrowseSkillComponent;
  let fixture: ComponentFixture<BrowseSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseSkillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
