import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LancamentosService {
  private apiUrl = '/api/lancamentos';

  constructor(private http: HttpClient) {}

  getLancamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  criarLancamento(lancamento: any): Observable<any> {
    return this.http.post(this.apiUrl, {
      ano: lancamento.ano,
      mes: lancamento.mes,
      toneladasProcessadas: lancamento.toneladas,
      energiaGerada: lancamento.energia,
      impostoAbatido: lancamento.imposto
    });
  }
}
