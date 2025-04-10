import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { NgxPaginationModule } from 'ngx-pagination';

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
    NgxPaginationModule,
  ],
  templateUrl: './skill-category.component.html',
  styleUrl: './skill-category.component.scss',
})
export class SkillCategoryComponent implements OnInit {
  skillsCategory: any[] = [];
  isAddModalOpen = false;
  categoryForm!: FormGroup;
  currentPage = 1;
  itemsPerPage = 4;
  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserService,
    private toast: ToastService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchSkillsCategory();
    this.initForm();
  }

  initForm() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

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
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchSkillsCategory();
      }
    });
  }

  closeAddCategoryModal() {
    this.isAddModalOpen = false;
  }

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

  getErrorMessage(controlName: string): string {
    const control = this.categoryForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required!`;
    } else if (control?.hasError('minlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${
        control.errors?.['minlength'].requiredLength
      } characters!`;
    }
    return '';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.categoryForm.controls;
  }

  deleteCategory(id: string) {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    this.userService.deleteSkillCategory(id).subscribe({
      next: (res: any) => {
        this.toast.info(res.message || 'Deleted successfully..');
        setTimeout(() => this.fetchSkillsCategory(), 1500);
      },
      error: (err) => {
        console.error('Error deleting category:', err);
        this.toast.error(err.error?.message || 'Failed to delete category!');
      },
    });
  }

  openEditCategoryModal(category: any) {
    const dialogRef = this.dialog.open(EditSkillCategoryComponent, {
      width: '35rem',
      height: 'auto',
      data: category,
    });

    dialogRef.afterClosed().subscribe((updatedCategory) => {
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

  filteredCategories(): any[] {
    let filtered = this.skillsCategory.filter((skill) => {
      const term = this.searchTerm.toLowerCase();
      return (
        skill.name?.toLowerCase().includes(term) ||
        skill.description?.toLowerCase().includes(term)
      );
    });

    if (this.sortColumn) {
      filtered.sort((a, b) => {
        const valA = a[this.sortColumn]?.toString().toLowerCase() || '';
        const valB = b[this.sortColumn]?.toString().toLowerCase() || '';
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }

    return filtered;
  }

  changeSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}
