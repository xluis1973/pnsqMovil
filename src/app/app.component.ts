import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutorizaService } from './services/autoriza.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private autSrv:AutorizaService) {}
  
  ngOnInit(): void {
    
  }
  
}
