import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExposicionesComponent } from '../../components/exposiciones/exposiciones.component';
import { ExposicionService } from '../../services/exposiciones.service';


@Component({
  selector: 'app-exposicion-admin',
  templateUrl: './exposicion-admin.component.html',
  styleUrls: ['./exposicion-admin.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class ExposicionAdminComponent implements OnInit {
  exposiciones: any[] = [];

  constructor(private exposicionService: ExposicionService) {}

  ngOnInit(): void {
    this.getExposiciones();
  }

  getExposiciones() {
    this.exposicionService.getExposiciones().subscribe(data => {
      this.exposiciones = data;
    });
  }

  eliminarExposicion(id: number) {
    this.exposicionService.deleteExposicion(id).subscribe(() => this.getExposiciones());
  }
}
