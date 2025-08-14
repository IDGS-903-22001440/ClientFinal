import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ComentarioInterface {
  id: number;
  contenido: string;
  fecha: string; // o Date, si lo parseas
  usuario: string;
  haCompradoProducto: boolean;
  likes: number;
  dislikes: number;
  userVoto: boolean | null; // ← este campo te estaba causando el error
  eliminado: boolean;
  respuestas: ComentarioInterface[];
}

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = 'https://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Obtener comentarios de un producto
  obtenerComentarios(productoId: number): Observable<ComentarioInterface[]> {
    return this.http.get<ComentarioInterface[]>(`${this.apiUrl}/comentarios/producto/${productoId}`);
  }


  // Enviar voto (like o dislike)
  votarComentario(comentarioId: number, esLike: boolean): Observable<any> {
    const body = { comentarioId, esLike };
    return this.http.post(`${this.apiUrl}/ComentarioVotes`, body);
  }

  crearComentario(productoId: number, contenido: string, parentComentarioId?: number): Observable<any> {
    const body: any = { productoId, contenido };
    if (parentComentarioId) body.parentComentarioId = parentComentarioId;
    return this.http.post(`${this.apiUrl}/comentarios`, body);
    }

    eliminarComentario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comentarios/${id}`);
    }
}