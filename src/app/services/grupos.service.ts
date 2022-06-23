import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, collection,setDoc,doc, query, where, getDoc, addDoc, getDocs } from 'firebase/firestore';
import { Grupo, Visitante, Usuario } from '../interfaces/interfaces';

import { getAuth } from 'firebase/auth';
import { registerLocaleData } from '@angular/common';


const app = initializeApp(firebaseConfig);

const auth = getAuth();


const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class GruposService {

   visitantesActivos:Visitante[]=[];
    visitantesEnGrupos:string[]=[];
    visitantesDeEsteG:string[]=[];
     usuariosActivos:Usuario[]= [];
     idUsuariosActivos:string[]=[];

  constructor() { }


  async obtenerVisitantes(idGuiaResponsable:string,hayGrupo:boolean):Promise<Usuario[]>{
 
    this.visitantesActivos=[];
    this.visitantesEnGrupos=[];
    this.visitantesDeEsteG=[];
     this.usuariosActivos= [];
     this.idUsuariosActivos=[];
  if(!hayGrupo){
      await this.visitantesDeGruposActivos(idGuiaResponsable);
      await this.visitantesActivosSinGrupo();
  }else {

    await this.activosDeEsteGrupo(idGuiaResponsable);
    

  }
       return this.usuariosActivos;
  
  

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   async activosDeEsteGrupo( guiaResponsable:string){
  
    const grupoCol=collection(db,"grupo");
    const qGrupos=query(grupoCol,where("activo","==",true),where("guiaResponsable","==",guiaResponsable));
    const grupoSnapshot= await getDocs(qGrupos);
    const gruposList=grupoSnapshot.docs.map(doc=>doc.data());
    gruposList.forEach((grup)=>{
    
      let lectura:Grupo=grup as Grupo;
      console.log("Visitantes de este grupo ",lectura.visitantes);
      lectura.visitantes.forEach((visit)=>{
        this.visitantesDeEsteG.push(visit);
      });
    });


    //Une con coleccion Usuario
    const usuariosCol = collection(db, 'usuario');
   

    const q = query(usuariosCol,where("identificador","in",this.visitantesDeEsteG));

    const usuariosSnapshot = await getDocs(q);
    const usuariosLista=usuariosSnapshot.docs.map(doc=>doc.data());
    usuariosLista.forEach((user)=>{

      this.usuariosActivos.push(user as Usuario);
    });

      
   }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   async visitantesDeGruposActivos(guiaResponsable:string){

   
    const grupoCol=collection(db,"grupo");
    const qGrupos=query(grupoCol,where("activo","==",true),where("guiaResponsable","!=",guiaResponsable));
    const grupoSnapshot= await getDocs(qGrupos);
    const gruposList=grupoSnapshot.docs.map(doc=>doc.data());
    gruposList.forEach((grup)=>{
      let lectura:Grupo=grup as Grupo;
        lectura.visitantes.forEach((visit)=>{
          this.visitantesEnGrupos.push(visit);
        })
    });

    

   }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   async visitantesActivosSinGrupo(){

    
    const usuariosCol = collection(db, 'usuario');
    const visitantesCol=collection(db,'visitante');

    const q = query(usuariosCol,where("activo","==",true));

    const usuariosSnapshot = await getDocs(q);
    const usuariosList=usuariosSnapshot.docs.map(doc=>doc.data());
    usuariosList.forEach((user) => {
      let lectura: Usuario = user as Usuario;
      this.idUsuariosActivos.push(lectura.identificador);
      this.usuariosActivos.push(lectura);

    })

    console.log("usuarios Activos ",this.usuariosActivos);
    //Se queda con los usuarios activos que son visitantes
    const q2 = query(visitantesCol,where("usuario","in",this.idUsuariosActivos));

    const visitantesSnapshot = await getDocs(q2);
    
    const visitantesList = visitantesSnapshot.docs.map(doc => doc.data());
    
  visitantesList.forEach((visita)=>{

      let lectura:Visitante=visita as Visitante;
     
      this.visitantesActivos.push(lectura);
           
    
    });

   let visitasSinGrupo=this.visitantesActivos.map(elem=>{
       if(this.visitantesEnGrupos.find(dato=> dato==elem.identificador)!=null){
            return null;
       }else {
         return elem;
       }
      });
    visitasSinGrupo= visitasSinGrupo.filter(elem=>elem!=null);   
    console.log("Visitantes en grupos activos que no es este grupo ",this.visitantesEnGrupos);
    console.log("visitantes Activos sin Grupos ",this.visitantesActivos);
    console.log("visitantes Activos sin Grupos ",visitasSinGrupo);
    
    this.usuariosActivos=this.usuariosActivos.map((elem)=>{
      if(visitasSinGrupo.find(dato=> dato.identificador==elem.identificador)!=null){
        return elem;
      }else{
        return null;
      }
    });

    this.usuariosActivos=this.usuariosActivos.filter(elem=>elem!=null);

   }
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
   async crearGrupo(grupo:Grupo){

    const grupoCol=collection(db,"grupo");
    grupo.activo=true;
    await addDoc(grupoCol,grupo);
 


   }

    async grupoActivo(grupo:Grupo):Promise<Grupo>{



      const grupoCole=collection(db,"grupo");
    const qGrupos=query(grupoCole,where("activo","==",true),where("guiaResponsable","==",grupo.guiaResponsable));
    const grupoSnapshot= await getDocs(qGrupos);
    if(grupoSnapshot.docs.length>0){
    let identificador=grupoSnapshot.docs[0].data() as Grupo;
    return identificador;
    }else return grupo;

    }


   
   async desarmarGrupo(grupo:Grupo){
    const grupoCole=collection(db,"grupo");
    const qGrupos=query(grupoCole,where("activo","==",true),where("guiaResponsable","==",grupo.guiaResponsable));
    const grupoSnapshot= await getDocs(qGrupos);
    let identificador=grupoSnapshot.docs[0].id;
   
    const grupoCol=doc(db,"grupo",identificador);
    grupo.activo=false
    //const qGrupos=query(grupoCol,where("activo","==",true),where("guiaResponsable","==",grupo.guiaResponsable));
    await setDoc(grupoCol,grupo).catch(error=>console.log("Error al desarmar Grupo",error));


   }

}


