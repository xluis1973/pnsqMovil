import { AfterViewInit, Component,ElementRef,ViewChild } from '@angular/core';
import { Marker } from 'src/app/interfaces/interfaces';
declare var google:any;

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements AfterViewInit {

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



  constructor() { }
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
          clickable : true
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

  renderMarkets(){
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
