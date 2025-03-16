import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
//   template: `
//   <h1>Angular Standalone App</h1>
//   <router-outlet></router-outlet>
// `,
  imports: [ RouterOutlet, RouterModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Welcome to Futura';

  // ngOnInit(): void {
  //   const fontSize = getComputedStyle(document.documentElement).fontSize;
  //   console.log(fontSize);  // Logs the font size of the root element
  // }

}

