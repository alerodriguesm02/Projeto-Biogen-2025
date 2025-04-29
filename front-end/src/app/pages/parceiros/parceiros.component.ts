import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { BannerCtaComponent } from '../../banner-cta/banner-cta.component';

@Component({
  selector: 'app-parceiros',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, BannerCtaComponent],
  templateUrl: './parceiros.component.html',
  styleUrl: './parceiros.component.css'
})
export class ParceirosComponent {

}
