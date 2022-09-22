import { Component } from '@angular/core';
import {FooterService} from "../../Services/footer.service";

@Component({
  selector: 'footer-bar',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css']
})

export class FooterComponent {

  constructor( public footerService: FooterService ) {}
}
