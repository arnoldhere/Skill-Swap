import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadDialogComponent } from './image-upload-dialog.component';

describe('ImageUploadDialogComponent', () => {
  let component: ImageUploadDialogComponent;
  let fixture: ComponentFixture<ImageUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
