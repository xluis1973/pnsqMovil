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

  map:any;
  @ViewChild('map',{read: ElementRef, static: false}) mapRef:ElementRef;

markers: Marker[]=[

  {
    position: {
      lat: -32.495849,
      lng: -67.005093
    },
    title: 'visitante 1'
  }

 
];



constructor(private geolocation: Geolocation) {}
  ngAfterViewInit(): void {
   
  }

  ionViewDidEnter(){

    this.loadMap();
  }
  
 

  

  async loadMap(){
    const mapEle:HTMLElement = document.getElementById('map');
    const myLatLng=new google.maps.LatLng(-32.495849,-67.005093);
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
      this.map.setCenter(new google.maps.LatLng(-32.495849, -67.005093));
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
        title: 'Yo soy este'
      }
    );
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
          title: 'Yo soy este'
        }
      );
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    
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
      }else{
        let diferenciaLatitud=Math.abs(this.lastPosition.coords.latitude-(data as Geoposition).coords.latitude);
        let diferenciaLongitud=Math.abs(this.lastPosition.coords.longitude-(data as Geoposition).coords.longitude);
        if(diferenciaLongitud>100 || diferenciaLatitud>100){
          this.lastPosition=(data as Geoposition);
          console.log("Cambio",(data as Geoposition).coords.latitude);
      this.addMarker({
        position: {
          lat: (data as Geoposition).coords.latitude,
          lng:(data as Geoposition).coords.longitude
        },
        title: 'Yo soy este'
      });
        }

        
      }
      
      
     });
    this.markers.forEach(marker=>{
    
      
      this.addMarker(marker);
      
    });
  }
//agregar marcador
  addMarker(marker:Marker){
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  
  }
  

}
