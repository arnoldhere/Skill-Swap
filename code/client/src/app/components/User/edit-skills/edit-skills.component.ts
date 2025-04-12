import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../others/navbar/navbar.component';
import { FooterComponent } from '../../others/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-skills',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    RouterModule
  ],
  templateUrl: './edit-skills.component.html',
  styleUrl: './edit-skills.component.scss'
})
export class EditSkillsComponent implements OnInit {

  skillForm!: FormGroup;
  categories: any[] = [];
  selectedFile!: File;
  skillId!: string;

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private userService: UserService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // Create the form
    this.skillForm = this.fb.group({
      category: ['', Validators.required],
      fees: ['', Validators.required],
      pdf: [null] // Optional
    });

    this.userService.fetchSkillsCategory().subscribe({
      next: (res: any) => {
        this.categories = res.categories;
        console.log(this.categories)
      },
      error: () => {
        this.toast.error('Error fetching skill data');
      }
    });

    // Get skillId from route param
    this.activatedRoute.paramMap.subscribe(params => {
      this.skillId = params.get('id') || '';
      if (this.skillId) {
        this.getSkillData(this.skillId);
      }
    });
  }

  getSkillData(id: string) {
    const uid = localStorage.getItem("id") || "";
    this.userService.getUserSkillById(id, uid).subscribe({
      next: (res: any) => {
        const skill = res.skill;
        this.skillForm.patchValue({
          category: skill.category?._id || '',
          fees: skill.fees || ''
        });
      },
      error: () => {
        this.toast.error('Error fetching skill data');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.skillForm.get('pdf')?.setValue(file.name); // Mark as valid
    } else {
      this.toast.error('Please upload a valid PDF file');
    }
  }


  submit() {
    if (this.skillForm.invalid) {
      this.toast.warn('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('category', this.skillForm.get('category')?.value);
    formData.append('fees', this.skillForm.get('fees')?.value);
    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }

    const uid = localStorage.getItem("id") || "";
    console.log(formData.values)
    this.userService.updateUserSkill(uid, this.skillId, formData).subscribe({
      next: () => {
        this.toast.success('Skill updated successfully');
        this.route.navigate(['/user/profile']);
      },
      error: () => {
        this.toast.error('Failed to update skill');
      }
    });
  }
}
