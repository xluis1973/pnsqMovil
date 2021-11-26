import { AfterViewInit, Component,ElementRef,ViewChild } from '@angular/core';
import { Marker } from 'src/app/interfaces/interfaces';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geoposition } from '@ionic-native/geolocation';
declare var google:any;

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements AfterViewInit {
  private lastPosition:Geoposition;
  private lectura:boolean=false;
  private icono="/assets/icon/marcador.png"

  map:any;
  @ViewChild('map',{read: ElementRef, static: false}) mapRef:ElementRef;

markers: Marker[]=[

  {
    position: {
      lat: -32.495849,
      lng: -67.005093
    },
    title: 'visitante 1',
    label: 'Esta es la etiqueta'
  }

 
];

hecho:boolean=false;
private marcador=null;

constructor(private geolocation: Geolocation) {}
  ngAfterViewInit(): void {
   
  }

  ionViewDidEnter(){

    this.loadMap();
  }
  
 

  
// Generación de mapa 
  async loadMap(){
    const mapEle:HTMLElement = document.getElementById('map');
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
    console.log(ctaLayer);

    ctaLayer.setMap(this.map);
    setTimeout(() => {
      this.map.setCenter(new google.maps.LatLng(-33.1726642,-66.3098262));
      this.map.setZoom(15);
      
}, 3000);
   console.log(this.map);
    google.maps.event.addListenerOnce(this.map,'idle',()=>{
      
      mapEle.classList.add('show-map');
      this.renderMarkets();
    });
       
  }

  async renderMarkets(){
    const geopo=await this.geolocation.getCurrentPosition();
    
    this.markers.push(
      {
        position: {
          lat:geopo.coords.latitude,
          lng: geopo.coords.longitude
        },
        title: 'Yo soy este',
        label: 'Esta es la etiqueta'
      }
    );
   
    
     let watch = this.geolocation.watchPosition({
      maximumAge: 3000,
      enableHighAccuracy: true
    });
     watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      //data.coords.latitude
      // data.coords.longitude
      if(!this.lectura){
        this.lastPosition=(data as Geoposition);
        console.log("latitud dentro",(data as Geoposition).coords.latitude);
          console.log("longitud dentro",(data as Geoposition).coords.longitude);
          this.marcador= new google.maps.Marker({
            position: new google.maps.LatLng((data as Geoposition).coords.latitude,(data as Geoposition).coords.longitude),
            draggable: true,
                  map: this.map,
                  title: "Título",
                  animation: google.maps.Animation.DROP,
            
            icon: "/assets/icon/marcador.png",
            label: {
              color: 'blue',
              fontWeight: 'bold',
              text: 'yo',
            },
          });
      }else{
        this.marcador=null;
        let diferenciaLatitud=Math.abs(this.lastPosition.coords.latitude-(data as Geoposition).coords.latitude);
        let diferenciaLongitud=Math.abs(this.lastPosition.coords.longitude-(data as Geoposition).coords.longitude);
        if(diferenciaLongitud>10 || diferenciaLatitud>10){
          this.lastPosition=(data as Geoposition);
          console.log("Cambio",(data as Geoposition).coords.latitude);
          console.log("Cambio",(data as Geoposition).coords.longitude);
          this.marcador= new google.maps.Marker({
            position: new google.maps.LatLng((data as Geoposition).coords.latitude,(data as Geoposition).coords.longitude),
            draggable: true,
                  map: this.map,
                  animation: google.maps.Animation.DROP,
            title: "Yo",
            icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
            label: {
              color: 'blue',
              fontWeight: 'bold',
              text: 'Hello world',
            },
          });
          
     /* this.addMarker({
        position: {
          lat: (data as Geoposition).coords.latitude,
          lng:(data as Geoposition).coords.longitude
        },
        title: 'Yo soy este'
      });*/
        }

        
      }
      
      
     });
   /* this.markers.forEach(marker=>{
    
      
      this.addMarker(marker);
      
    });*/
  }
//agregar marcador
  addMarker(marker:Marker){
    
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  
  }
  
  onClick(){
    
    
    
  
    if(!this.hecho){
      this.marcador= new google.maps.Marker({
        position: new google.maps.LatLng(-33.1726642,-66.3098262),
        draggable: true,
              map: this.map,
              animation: google.maps.Animation.DROP,
        title: 'Yo'
      });
      
      this.hecho=true;
    }else {
      this.marcador.setMap(null);
      this.marcador=null;
      this.hecho=false;
      console.log("Borrando");
    }

    }
   
    posicionActual(){

      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log("latitud ",resp.coords.latitude);
        this.markers.push(
          {
            position: {
              lat: resp.coords.latitude,
              lng: resp.coords.longitude
            },
            title: 'Yo soy este',
            label: 'Esta es la etiqueta'
          }
        );
       }).catch((error) => {
         console.log('Error getting location', error);
       });

    }

}
