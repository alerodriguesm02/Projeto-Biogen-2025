import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-banner-cta',
  standalone: true,
  imports: [RouterLink,RouterLinkActive ],
  templateUrl: './banner-cta.component.html',
  styleUrl: './banner-cta.component.css'
})
export class BannerCtaComponent {

}
