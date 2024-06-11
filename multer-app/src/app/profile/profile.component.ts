import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  selectedFile: File | null = null;
  submittedProfiles: any[] = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.getProfiles();
  }

  onSubmit() {
    if (this.profileForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.profileForm.value.name);
      formData.append('image', this.selectedFile);

      this.http.post('http://localhost:3000/upload', formData).subscribe({
        next: (response) => {
          console.log(response);
          this.getProfiles();
          this.profileForm.reset();
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Error occurred while uploading:', error);
          alert('An error occurred while uploading. Please try again.');
        }
      });
    } else {
      console.error('Form is invalid or no file selected.');
      alert('Please fill in the form correctly and select a file.');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  getProfiles() {
    this.http.get<any[]>('http://localhost:3000/profiles').subscribe({
      next: (profiles) => {
        console.log('Profiles fetched successfully:', profiles);
        this.submittedProfiles = profiles;
      },
      error: (error) => {
        console.error('Error occurred while fetching profiles:', error);
        alert('An error occurred while fetching profiles. Please try again.');
      }
    });
  }
}
