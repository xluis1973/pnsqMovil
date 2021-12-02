import {  Component,ElementRef,ViewChild } from '@angular/core';
import { Marker } from 'src/app/interfaces/interfaces';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geoposition } from '@ionic-native/geolocation';
import {filter} from 'rxjs/operators';
import { Subscription } from 'rxjs';
declare var google:any;

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage  {
  private lastPosition:Geoposition;
  private lectura:boolean=false;
  private miPosicionActual:GeolocationPosition;
  private markers:any[]=[];
  private watch: Subscription;

  map:any;
  @ViewChild('map',{read: ElementRef, static: false}) mapRef:ElementRef;

  constructor(private geolocation: Geolocation) {}


  

  ionViewDidEnter(){

    //Obtiene mi posición actual
    this.posicionActual();
    //Recreo el mapa
    this.loadMap();
    //Obtener lecturas de GPS
    this.obtenerLecturasGPS();
    
  }
  
 

  
// Generación de mapa 
  async loadMap(){
    const mapEle:HTMLElement = document.getElementById('map');
    //Coordenadas PNSQ LatLng(-33.1726642,-66.3098262)
    //const myLatLng=new google.maps.LatLng(this.miPosicionActual.coords.latitude,this.miPosicionActual.coords.longitude);
    const myLatLng=new google.maps.LatLng(-33.1726642,-66.3098262);
    const options={
      center: myLatLng,
      zoom: 15,
      disableDefaultUI:true
    };

    this.map= await new google.maps.Map(this.mapRef.nativeElement,options);

//https://drive.google.com/file/d/1aUAxnV5IBJoZnCLK3-qJFfUoZpsqSlpA/view?usp=sharing
  var ctaLayer = await new google.maps.KmlLayer({
      url: 'https://drive.google.com/uc?id=1aUAxnV5IBJoZnCLK3-qJFfUoZpsqSlpA',
     suppressInfoWindows: false,  
        map:this.map,
        zindex: 0,
          clickable : true,
          
          
    }); 
    
    ctaLayer.setMap(this.map);
    setTimeout(() => {
      //Coordenadas PNSQ LatLng(-33.1726642,-66.3098262)
      this.map.setCenter(new google.maps.LatLng(this.miPosicionActual.coords.latitude,this.miPosicionActual.coords.longitude));
      this.map.setZoom(15);
      
}, 3000);
  
    google.maps.event.addListenerOnce(this.map,'idle',()=>{
      
      mapEle.classList.add('show-map');
      this.addMarker();
    });
       
  }

   obtenerLecturasGPS(){
    
   
    //Subscripción a lecturas de GPS
    this.watch = this.geolocation.watchPosition({
      maximumAge: 3000,
      enableHighAccuracy: true
    })
    
    .subscribe((data) => {

      // data can be a set of coordinates, or an error (if an error occurred).
      //data.coords.latitude
      // data.coords.longitude
      setTimeout(()=>{
      console.log("Entrada ");
      if(!this.lectura){
        this.lastPosition=(data as Geoposition);
    
          this.markers.push(new google.maps.Marker({
            position: new google.maps.LatLng((data as Geoposition).coords.latitude,(data as Geoposition).coords.longitude),
            draggable: false,
                  map: this.map,
                  title: "Título",
                         
            
          })
          );
          this.lectura=true;
          console.log("Salida ");
      }else{
        
        let diferenciaLatitud=Math.abs(this.lastPosition.coords.latitude-(data as Geoposition).coords.latitude);
        let diferenciaLongitud=Math.abs(this.lastPosition.coords.longitude-(data as Geoposition).coords.longitude);
        if(diferenciaLongitud>10 || diferenciaLatitud>10){
           this.limpiaMarcadores();
          this.lastPosition=(data as Geoposition);
          console.log("Cambio",(data as Geoposition).coords.latitude);
          console.log("Cambio",(data as Geoposition).coords.longitude);

          this.markers.push(new google.maps.Marker({
            position: new google.maps.LatLng((data as Geoposition).coords.latitude,(data as Geoposition).coords.longitude),
            draggable: false,
                  map: this.map,
                  title: "Título",
                         
            
          }));
          
     /* this.addMarker({
        position: {
          lat: (data as Geoposition).coords.latitude,
          lng:(data as Geoposition).coords.longitude
        },
        title: 'Yo soy este'
      });*/
        }

        
      }});
      
      
     });
   /* this.markers.forEach(marker=>{
    
      
      this.addMarker(marker);
      
    });*/
    
  }
//agregar marcador
  addMarker(){
    
   /* return new google.maps.Marker({
      position:{
        lat: this.miPosicionActual.coords.latitude,
        lng:this.miPosicionActual.coords.longitude
      },
      map: this.map,
      title: 'yo'
    });
  */
  }
  
  
   
    async posicionActual(){

      console.log("posicion actual");
      await this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        this.miPosicionActual=(resp as GeolocationPosition);
        console.log("obteniendo posicion ",resp);
        this.markers.push(
          new google.maps.Marker({
            position: new google.maps.LatLng(this.miPosicionActual.coords.latitude,this.miPosicionActual.coords.longitude),
            draggable: false,
                  map: this.map,
                  title: "Título",
                         
            
          })
        );
        console.log("colocado ",this.miPosicionActual);
       }).catch((error) => {
         console.log('Error getting location', error);
       });

    }

    limpiaMarcadores() {
      this.markers.forEach((marca)=>{
        marca.setMap(null);
         marca=null;});
      this.markers=[];
    }
    

}

