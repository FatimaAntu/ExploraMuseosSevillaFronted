import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Verifica si el usuario tiene rol ADMIN
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser && currentUser.rol === 'ADMIN';
  }
}
