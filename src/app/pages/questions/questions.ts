import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-questions',
  imports: [MatIconModule],
  templateUrl: './questions.html',
  styleUrl: './questions.css'
})
export class Questions {
  // Cada índice representa una sección
  seccionesVisibles: boolean[] = [false, false, false, false, false, false, false, false, false, false];

  toggleSeccion(index: number): void {
    this.seccionesVisibles[index] = !this.seccionesVisibles[index];
  }
}
