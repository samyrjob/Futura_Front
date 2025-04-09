import { Component } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { RouterModule } from '@angular/router';
import { Utilisator } from '../model/Utilisator';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-new-users',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './new-users.component.html',
  styleUrl: './new-users.component.scss'
})
export class NewUsersComponent {

  utilisators: Utilisator[] = [];
  

  constructor(private apiService: ApiService){
  }

  ngOnInit(){
    this.fetchUtilisateurs();
  }



  
  public fetchUtilisateurs(){
    this.apiService.getAllUtilisateurs().subscribe(
      (data: Utilisator[]) => {
        this.utilisators = data;
      },
      (error) => {
        console.error('Error fetching utilisateurs:', error);
      }
    );
  }
}
