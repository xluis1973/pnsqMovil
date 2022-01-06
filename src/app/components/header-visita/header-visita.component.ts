import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-visita',
  templateUrl: './header-visita.component.html',
  styleUrls: ['./header-visita.component.scss'],
})
export class HeaderVisitaComponent implements OnInit {

  @Input() titulo:string ='';
  constructor() { }

  ngOnInit() {}

  cerrarSesion(){}
}
