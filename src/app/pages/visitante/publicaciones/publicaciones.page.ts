import { Component, OnInit } from '@angular/core';
import { Publicacion } from 'src/app/interfaces/interfaces';
import { PublicarService } from 'src/app/services/publicar.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.page.html',
  styleUrls: ['./publicaciones.page.scss'],
})
export class PublicacionesPage implements OnInit {

  publicaciones:Publicacion[];
  constructor(private publicarSrv:PublicarService) { }

  ngOnInit() {
    this.publicarSrv.obtenerPublicaciones().then((resp)=>{
      this.publicaciones=resp;
    });

    this.publicarSrv.publishListener.subscribe((resp)=>
    
        this.publicarSrv.obtenerUltimaPublicacion().then((resp)=>{
      this.publicaciones.unshift(resp);
    }));

    this.publicarSrv.obtenerUltimaPublicacion();
  }
  

  onClick(){}
}
