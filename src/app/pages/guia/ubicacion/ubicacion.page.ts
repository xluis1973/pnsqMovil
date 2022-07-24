import {  Component,ElementRef,ViewChild } from '@angular/core';
import { Marker, Ubicacion } from 'src/app/interfaces/interfaces';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geoposition } from '@ionic-native/geolocation';
import {filter} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { AutorizaService } from 'src/app/services/autoriza.service';
import { MonitoreoService } from '../../../services/monitoreo.service';
import { Usuario } from '../../../interfaces/interfaces';
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
  private ubicacionActual:Ubicacion=null;
  private usuarioActual:Usuario;
  public static ultimaLectura:Ubicacion=null;  
  public static salio:boolean=false;

  map:any;
  @ViewChild('map',{read: ElementRef, static: false}) mapRef:ElementRef;

  constructor(private geolocation: Geolocation, 
    private ubicacionSrv:UbicacionService, private autoSrv:AutorizaService,
    private monitorSrv:MonitoreoService) {}



  ionViewDidEnter(){
    UbicacionPage.salio=false;

    this.usuarioActual=this.autoSrv.obtenerNombreUsuarioLogueado();
    console.log("iniciando mapa");
    //Obtiene mi posición actual
    this.posicionActual();
    //Recreo el mapa
    this.loadMap();
    //Obtener lecturas de GPS
  
      this.obtenerLecturasGPS();

   
    
    this.monitorSrv.leerUbicaciones().subscribe(resp=>{

      //this.limpiaMarcadores();
      let marcador;
      resp.forEach(ubicacion=>{

        marcador=new google.maps.Marker({

          position:new google.maps.LatLng(ubicacion.latitud,ubicacion.longitud),
          draggable:false,
          
          label: {
            fontSize: "6pt",
            text: ubicacion.identificador
        },
          map: this.map,
          
        icon: {         url: "../assets/icon/pin.png",
                  scaledSize: new google.maps.Size(30, 30)    
            } 
          /*icon: {
            size: new google.maps.Size(48, 59),
            anchor: new google.maps.Point(24, 59),
            url: '../assets/icon/pin.png',
            text: {
              content: '!',
              color: '#fff',
              size: '24px',
              weight: '700',
              position: [25, 24]
            }
          }*/
        });
        console.log("Antes de Pushhhhhh");
        marcador.addListener('click',function(){

          const infoWindow = new google.maps.InfoWindow();
          infoWindow.close();
          infoWindow.setContent('marcador.getTitle()');
          infoWindow.open(marcador.getMap(), marcador);

        });
       this.markers.push(marcador);
        
      });
      if(marcador){
        console.log("Haciendo zoom");
        this.map.setCenter(marcador.getPosition());
        this.map.setZoom(17);
      }

    });
    
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
      maximumAge: 5000,
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
          this.ubicacionActual={
            latitud: (data as Geoposition).coords.latitude,
            longitud: (data as Geoposition).coords.longitude,
            fechaHora: new Date(),
            usuario: this.usuarioActual.identificador,
            identificador:"Guia " +this.usuarioActual.nombre,
          
          }
          UbicacionPage.ultimaLectura=this.ubicacionActual;
          if(!UbicacionPage.salio){
            this.ubicacionSrv.guardarDatos(this.ubicacionActual);
          }
          
      }else{
        
        let diferenciaLatitud=Math.abs(this.lastPosition.coords.latitude-(data as Geoposition).coords.latitude);
        let diferenciaLongitud=Math.abs(this.lastPosition.coords.longitude-(data as Geoposition).coords.longitude);
       
        console.log("Diferencia Lat",diferenciaLatitud);
        console.log("Diferencia Long",diferenciaLongitud);
        const distancia= this.calcularDistancia(this.lastPosition,(data as Geoposition));
        console.log("distancia ",distancia);
        if(distancia>1){
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
          this.ubicacionActual={
            latitud: (data as Geoposition).coords.latitude,
            longitud: (data as Geoposition).coords.longitude,
            fechaHora: new Date(),
            usuario: this.usuarioActual.identificador,
            identificador:"Guia "+ this.usuarioActual.nombre,
          
          }
          UbicacionPage.ultimaLectura=this.ubicacionActual;
          if(!UbicacionPage.salio){
            this.ubicacionSrv.guardarDatos(this.ubicacionActual);
          }
         
        }

        
      }});
      
      
     });
     
  
 
    
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
      /*this.markers.forEach((marca)=>{
        marca.setMap(null);
         marca=null;});
      this.markers=[];*/
      for(let a in this.markers){
        this.markers[a].setMap(null);
      }
      this.markers=[];
    }
    


    //Fórmula de Haversine 
    /*dlon = lon2 - lon1
      dlat = lat2 - lat1
      a = sin^2(dlat/2) + cos(lat1) * cos(lat2) * sin^2(dlon/2)
      c = 2 * arcsin(min(1,sqrt(a)))
      d = R * c*/
    calcularDistancia(posOrigen:Geoposition,posDestino:Geoposition):number{

      const radioDeLaTierra=6378.0;
      const difLatitud:number = (posDestino.coords.latitude - posOrigen.coords.latitude);
      const difLongitud = (posDestino.coords.longitude -posOrigen.coords.longitude);


      const a = this.AlCuadrado(Math.sin(difLatitud/2)) +
          Math.cos(this.EnRadianes(posOrigen.coords.latitude))*
          Math.cos(this.EnRadianes(posDestino.coords.latitude))*
          this.AlCuadrado(Math.sin(difLongitud/2));
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      return radioDeLaTierra*c;
    }


     AlCuadrado(valor:number):number
{
  return Math.pow(valor, 2);
}

EnRadianes(valor:number):number
{
  return (Math.PI / 180) * valor;
}

/*ionViewDidLeave(){
  console.log("Se deslogueo");
  if(UbicacionPage.salio){
    console.log("Dejó de registrar");
    this.watch.unsubscribe();
  }
}*/
}

