import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment.prod';
import { getFirestore, collection,setDoc,doc, query, where, getDoc, addDoc, getDocs } from 'firebase/firestore';
import { Grupo, Visitante, Usuario } from '../interfaces/interfaces';

import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);

const auth = getAuth();


const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  visitantesActivos:Visitante[]=[];
  idUsuariosActivos:String[]=[];
  usuariosActivos:Usuario[]= [];
  visitantesEnGrupos:String[]=[];
  constructor() { }


  async obtenerVisitantes():Promise<Usuario[]>{
    //Obtengo los usuarios activos (es decir los que están logueados)
    this.visitantesActivos=[];
    const usuariosCol = collection(db, 'usuario');
    const visitantesCol=collection(db,'visitante');
    const grupoCol=collection(db,"grupo");


    const qGrupos=query(grupoCol,where("activo","==",true));
    const grupoSnapshot= await getDocs(qGrupos);
    const gruposList=grupoSnapshot.docs.map(doc=>doc.data());
    gruposList.forEach((grup)=>{
      let lectura:Grupo=grup as Grupo;
        lectura.visitantes.forEach((visit)=>{
          this.visitantesEnGrupos.push(visit);
        })
    });

    const q = query(usuariosCol,where("activo","==",true));

    const usuariosSnapshot = await getDocs(q);
    const usuariosList=usuariosSnapshot.docs.map(doc=>doc.data());
    usuariosList.forEach((user) => {
      let lectura: Usuario = user as Usuario;
      this.idUsuariosActivos.push(lectura.identificador);
      this.usuariosActivos.push(lectura);

    })
    console.log("usuarios Activos ",this.usuariosActivos);
    const q2 = query(visitantesCol,where("usuario","in",this.idUsuariosActivos));

    const visitantesSnapshot = await getDocs(q2);
    
    const visitantesList = visitantesSnapshot.docs.map(doc => doc.data());
    
  visitantesList.forEach((visita)=>{

      let lectura:Visitante=visita as Visitante;
     
      this.visitantesActivos.push(lectura);
           
    
    });
    console.log("visitantes Activos ",this.visitantesActivos);
    
      
  const nuevo=this.usuariosActivos.map((elem)=>{

    
    const resultado=this.visitantesActivos.find(dato=> dato.identificador===elem.identificador);
    console.log("Visitante encontrado ",resultado);
    if (resultado!=null){
      return elem;
    }else{

      elem.identificador="--";
      return elem;

    }

    });
  
    this.usuariosActivos=nuevo.filter(elem=>elem.identificador != '--');
    

  const usuariosSinGuia=this.usuariosActivos.map((elem)=>{

    const resultado=this.visitantesEnGrupos.find(dato=> dato==elem.identificador);
    console.log("Visitante encontrado sin guia ",resultado);
    if (resultado!=null){
      elem.identificador="--"
      return elem;
    }else{
      return elem;

    }



  });
  this.usuariosActivos=usuariosSinGuia.filter(elem=>elem.identificador != '--');


    console.log("usuarios Activos Visitantes",this.usuariosActivos);
    return this.usuariosActivos;
   }

}
