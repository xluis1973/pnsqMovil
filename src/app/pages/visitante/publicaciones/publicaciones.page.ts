import { Component, OnInit } from '@angular/core';
import { PublicarService } from 'src/app/services/publicar.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.page.html',
  styleUrls: ['./publicaciones.page.scss'],
})
export class PublicacionesPage implements OnInit {

  constructor(private publicarSrv:PublicarService) { }

  ngOnInit() {
    this.publicarSrv.notificacionesPush();
  }

  onClick(){}
}
