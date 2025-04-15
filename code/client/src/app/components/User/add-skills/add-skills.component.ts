import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../services/user.service';
import { NavbarComponent } from "../../others/navbar/navbar.component";
import { FooterComponent } from "../../others/footer/footer.component";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss'],
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, CommonModule, RouterModule]
})
export class AddSkillsComponent implements OnInit {
  skillForm!: FormGroup;
  categories: any[] = [];
  selectedFile!: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private userService: UserService,
    private route: Router
  ) { }

  ngOnInit() {
    this.skillForm = this.fb.group({
      category: ['', Validators.required],
      // fees: [null, Validators.required],
      pdf: [null, Validators.required], // You’re manually handling file validity
    });

    this.fetchCategories();
  }

  fetchCategories() {
    this.userService.getSkillsCategory().subscribe({
      next: (res) => (this.categories = res),
      error: () => this.toast.error('❗Failed to load skill categories'),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const pdfControl = this.skillForm.get('pdf');

    if (!file) {
      this.selectedFile = undefined;
      pdfControl?.setErrors({ required: true });
      return;
    }

    const isPDF = file.type === 'application/pdf';
    const isUnder10MB = file.size <= 10 * 1024 * 1024;

    if (isPDF && isUnder10MB) {
      this.selectedFile = file;
      pdfControl?.setErrors(null);
      pdfControl?.markAsTouched();
    } else {
      this.selectedFile = undefined;
      if (!isPDF) {
        pdfControl?.setErrors({ invalidType: true });
        this.toast.error('❌ Please upload a valid PDF file!');
      } else {
        pdfControl?.setErrors({ fileTooLarge: true });
        this.toast.error('📄 File size must be less than 10MB!');
      }
    }
  }



  submit() {
    console.log(this.skillForm.value)
    if (this.skillForm.invalid || !this.selectedFile) {
      this.toast.error('Please fill out the form properly');
      return;
    }

    const formData = new FormData();
    formData.append('category', this.skillForm.value.category);
    formData.append('document', this.selectedFile);
    formData.append('fees', this.skillForm.value.fees);

    const id = localStorage.getItem("id") || "";
    this.userService.uploadSkill(formData, id).subscribe({
      next: (res) => {
        this.toast.success(res.message || '✅ Skill added successfully!');
        this.route.navigate(["/user/profile"])
      },
      error: (err) => this.toast.error(err.message || '❌ Failed to add skill'),
    });
  }
}
