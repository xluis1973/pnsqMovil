import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { firebaseConfig } from "./../environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import {HttpClientModule} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,IonicStorageModule.forRoot(),HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFirestoreModule, GooglePlus, Geolocation,FCM],
  bootstrap: [AppComponent],
})
export class AppModule {}
