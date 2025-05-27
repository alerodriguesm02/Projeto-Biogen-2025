import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-solucao',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './solucao.component.html',
  styleUrl: './solucao.component.css'
})
export class SolucaoComponent {

}
