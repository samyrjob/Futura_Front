import { Component } from '@angular/core';
import { BodyComponent } from '../body/body.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [BodyComponent, RouterModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {



  title: string= "Futura";

}
