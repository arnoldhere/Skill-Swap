import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../others/header/header.component';
import { SidebarComponent } from '../others/sidebar/sidebar.component';
import { UserService } from '../../../services/user.service';
import { ToastService } from 'angular-toastify';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSkillCategoryComponent } from '../others/add-skill-category/add-skill-category.component';
import { EditSkillCategoryComponent } from '../others/edit-skill-category/edit-skill-category.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-skill-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HeaderComponent,
    SidebarComponent,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './skill-category.component.html',
  styleUrl: './skill-category.component.scss',
})
export class SkillCategoryComponent implements OnInit {
  skillsCategory: any[] = []; // 📚 Skill Categories Data
  isAddModalOpen = false; // ➕ Add Modal Visibility
  categoryForm!: FormGroup; // 📝 Category Form

  constructor(
    private userService: UserService,
    private toast: ToastService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }
  // private dialog = inject(MatDialog);


  ngOnInit(): void {
    this.fetchSkillsCategory(); // Load Skills on Init
    this.initForm(); // Initialize Form
  }

  // ✅ Initialize Add Category Form
  initForm() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  // 📚 Fetch Skill Categories
  fetchSkillsCategory() {
    this.userService.getSkillsCategory().subscribe({
      next: (res: any) => {
        this.skillsCategory = res;
      },
      error: (err) => {
        console.error('Error fetching skill categories:', err);
      },
    });
  }

  openAddCategoryModal() {
    const dialogRef = this.dialog.open(AddSkillCategoryComponent, {
      width: '35rem',
      height: 'auto',
      data: {}, // ✅ Pass empty data if adding new category
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchSkillsCategory(); // ✅ Refetch categories after adding
      }
    });
  }

  // ❌ Close Add Modal
  closeAddCategoryModal() {
    this.isAddModalOpen = false;
  }

  // 💾 Save New Skill Category
  saveCategory() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      this.userService.addSkillCategory(categoryData).subscribe({
        next: (res: any) => {
          this.toast.success('Category added successfully! 🎉');
          this.skillsCategory.unshift(res);
          this.closeAddCategoryModal();
        },
        error: (err) => {
          console.error('Error adding category:', err);
          this.toast.error('Failed to add category! ❗');
        },
      });
    } else {
      this.toast.warn('Please fix the form errors! ⚠️');
    }
  }

  // 📅 Format Date for Display
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // 📣 Get Custom Error Messages
  getErrorMessage(controlName: string): string {
    const control = this.categoryForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.replace(/^\w/, (c) =>
        c.toUpperCase()
      )} is required!`;
    } else if (control?.hasError('minlength')) {
      return `${controlName.replace(/^\w/, (c) =>
        c.toUpperCase()
      )} must be at least ${control.errors?.['minlength'].requiredLength
        } characters!`;
    }
    return '';
  }

  // 🎯 Get Form Controls for Validation
  get f(): { [key: string]: AbstractControl } {
    return this.categoryForm.controls;
  }

  deleteCategory(id: string) {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    this.userService.deleteSkillCategory(id).subscribe({
      next: (res: any) => {
        if (res) {
          this.toast.info(res.message || "Deleted successfully..");

          // 🔄 Instead of reloading, trigger a state update
          setTimeout(() => {
            this.fetchSkillsCategory()
          }, 1500);
        }
      },
      error: (err) => {
        console.error("Error deleting category:", err);
        this.toast.error(err.error?.message || "Failed to delete category!");
      },
    });
  }


  openEditCategoryModal(category: any) {
    console.log('Opening edit modal for:', category); // Debugging

    const dialogRef = this.dialog.open(EditSkillCategoryComponent, {
      width: '35rem',
      height: 'auto',
      data: category, // ✅ Pass category data properly
    });

    dialogRef.afterClosed().subscribe((updatedCategory) => {
      console.log('Modal closed', updatedCategory); // Debugging
      if (updatedCategory) {
        this.userService.updateSkillCategory(updatedCategory._id, updatedCategory).subscribe({
          next: () => {
            this.toast.success('Category updated successfully! 🎉');
            this.fetchSkillsCategory();
          },
          error: (err) => {
            console.error('Error updating category:', err);
            this.toast.error('Failed to update category! ❗');
          },
        });
      }
    });
  }


}
