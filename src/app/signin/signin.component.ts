import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ApiService } from '../shared/api.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';




@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})




export class SigninComponent {

  logInForm: FormGroup;
  errorMessage: string = '';



  // For testing purpose
  private userDatabase: { [key: string]: string} = {
    john: "123",
    rocky: "456",
    damien: "789"
  }



  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router){
    this.logInForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
      })
  }


  
    submit() {

      const { username, password } = this.logInForm.value;

      this.apiService.DoLogIn({username, password}).subscribe(
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
