import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';
// import { login } from '../app.actions';
import { login } from '../authentication/auth.actions';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})



export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: Router, private store: Store<AppState>) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      const credentials = {email, password};
      console.log("here for this.registerForm.value : ", this.registerForm.value)

      // const {email, password} = {username, email, password};
      this.apiService.DoRegister({username, ...credentials}).subscribe(
        (response) => {
          // Success: handle successful login, for example, navigate to another page
          console.log('Sign up successful', response);
          this.store.dispatch(login(credentials));



        },
        (error) => {
          // Error: display an error message if login failed
          this.errorMessage = 'Error in one field of registration';
          console.error('Registration failed', error);
        }
      );
    }

  
  }
}
