import { Component } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  // For reactive forms
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Required for animations
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    // BrowserAnimationsModule,
    CommonModule,ReactiveFormsModule, FormsModule, RouterModule
  ]
})
export class SigninComponent {


togglePasswordVisibility() {
  this.hidePassword = !this.hidePassword;
}
  signinForm!: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router){
    
  }
  
  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  
    onSubmit() {
      const { email, password } = this.signinForm.value;

      this.apiService.DoLogIn({email, password}).subscribe(
        (response) => {
          // Success: handle successful login, for example, navigate to another page
          console.log('Login successful', response);
            // Navigate to the dashboard after successful login
          this.router.navigate(['/profile']);

        },
        (error) => {
          // Error: display an error message if login failed
          this.errorMessage = 'Invalid username or password';
          console.error('Login failed', error);
        }
      );
    }
}
