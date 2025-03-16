import { Component } from '@angular/core';
import { Score } from './model/score';
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

  // score?: Score;
  // score: Score = {wins: 0, ties: 0, losses: 0};
  score!: Score;
  utilisators: Utilisator[] = [];
  

  constructor(private apiService: ApiService){
  }

  ngOnInit(){
    this.retrievescore();
    this.fetchUtilisateurs();
  }


  public retrievescore(){

    this.apiService.retrieveScore().subscribe(
      res => {
        this.score = res;
        console.log("score : ", res)
      },
      err => {
        const yeah = localStorage.getItem("JWT_Token");
        alert("an error has occured" +  `   ${yeah}`)
      }
    )

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
