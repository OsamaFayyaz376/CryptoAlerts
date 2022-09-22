import {Component, OnInit} from '@angular/core';
import {FooterService} from "./Services/footer.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private footerService: FooterService) {
  }

  ngOnInit() {
    this.footerService.show();
  }

}
