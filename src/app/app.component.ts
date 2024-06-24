import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

interface City {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, AsyncPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  userObj: USER = new USER();
  http = inject(HttpClient);

  cityList$: Observable<City[]> = new Observable<City[]>();
  stateList$: Observable<State[]> = new Observable<State[]>();
  userList: USER[] = [];

  mostrarNovoUsuario: boolean = true; // Variável de controle de visibilidade

  ngOnInit(): void {
    this.cityList$ = this.http.get<City[]>("http://localhost:3000/cityList");
    this.stateList$ = this.http.get<State[]>("http://localhost:3000/stateList");
    this.getUsers();
  }

  onFechar() {
    console.log("O botão foi clicado!");
    this.mostrarNovoUsuario = false; // Esconde a seção de Novo Usuário
  }

  onAbrir() {
    this.mostrarNovoUsuario = true; // Mostra a seção de Novo Usuário
  }

  getUsers() {
    this.http.get<USER[]>("http://localhost:3000/userList").subscribe((res: USER[]) => {
      this.userList = res;
    });
  }

  onSaveUser() {
    this.http.post<USER>("http://localhost:3000/userList", this.userObj).subscribe((res: USER) => {
      alert("User Created Successfully");
      this.userList.unshift(this.userObj);
      this.userObj = new USER(); // Reset the form
    });
  }

  onEdit(data: USER) {
    this.userObj = data;
  }

  onDelete(id: number) {
    const isDelete = confirm("Você quer deletar?");
    if (isDelete) {
      this.http.delete(`http://localhost:3000/userList/${id}`).subscribe(() => {
        alert("Deletado com sucesso");
        this.userList = this.userList.filter(user => user.id !== id); // filtra pelo campo correto
      },
      (error) => {
        console.error("Erro ao deletar usuário", error)
      });
    }
  }
}

export class USER {
  userId: number;
  userName: string;
  fName: string;
  lName: string;
  city: string;
  state: string;
  zipCode: string;
  id: number
  constructor() {
    this.userId = 0;
    this.userName = '';
    this.fName = '';
    this.lName = '';
    this.city = '';
    this.state = '';
    this.zipCode = '';
    this.id = 0;
  }
}
