import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../../services/user.service';
import { DialogModule } from '@angular/cdk/dialog';

@Component({
  selector: 'app-edit-skill-category',
  standalone: true,
  templateUrl: './edit-skill-category.component.html',
  styleUrls: ['./edit-skill-category.component.scss'],
  imports: [ReactiveFormsModule, CommonModule , RouterModule , FormsModule , DialogModule]
})
export class EditSkillCategoryComponent implements OnInit {
  editForm!: FormGroup;
  loading = false;
  categoryId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    // Get category ID from URL
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    // Initialize form
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      commission: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });

    if (this.categoryId) {
      this.loadCategoryData();
    }
  }

  // Fetch category data from the backend
  loadCategoryData() {
    this.userService.getSkillCategoryById(this.categoryId).subscribe({
      next: (data) => {
        this.editForm.patchValue(data); // Populate form fields
      },
      error: (err) => {
        console.error('Error loading category:', err);
        this.toast.error('Failed to load category details');
        this.router.navigate(['/admin/skill-categories']);
      },
    });
  }

  // Form submission
  saveChanges() {
    if (this.editForm.invalid) return;

    this.loading = true;
    const updatedCategory = { ...this.editForm.value, _id: this.categoryId };

    this.userService.updateSkillCategory(this.categoryId, updatedCategory).subscribe({
      next: () => {
        this.toast.success('Category updated successfully! 🎉');
        this.router.navigate(['/admin/skill-categories']); // Redirect after update
      },
      error: (err) => {
        console.error('Error updating category:', err);
        this.toast.error('Failed to update category! ❗');
      },
      complete: () => (this.loading = false),
    });
  }
}
