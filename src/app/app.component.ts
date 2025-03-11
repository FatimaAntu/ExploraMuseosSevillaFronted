import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';  
import { MuseosService } from './services/museos.service';
import { MuseosDTO } from './models/museos.dto';
import { NavbarComponent } from "./components/navbar/navbar.component"; 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  museos: MuseosDTO[] = [];

  constructor(private museosService: MuseosService) {}
  ngOnInit(): void {
    this.getMuseos();
  }

  getMuseos(): void {
    this.museosService.getMuseos().subscribe(
      (data: MuseosDTO[]) => {
        this.museos = data;
        console.log('Museos obtenidos:', this.museos);
      },
      (error) => {
        console.error('Error al obtener museos:', error);
      }
    );
  }
}

