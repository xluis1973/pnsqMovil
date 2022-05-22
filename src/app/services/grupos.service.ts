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
  
  constructor() { }


  async obtenerVisitantes():Promise<Usuario[]>{
    //Obtengo los usuarios activos (es decir los que están logueados)
   const visitantesActivos:Visitante[]=[];
  const idUsuariosActivos:String[]=[];
  let usuariosActivos:Usuario[]= [];
  const visitantesEnGrupos:String[]=[];

    
    const usuariosCol = collection(db, 'usuario');
    const visitantesCol=collection(db,'visitante');
    const grupoCol=collection(db,"grupo");


    const qGrupos=query(grupoCol,where("activo","==",true));
    const grupoSnapshot= await getDocs(qGrupos);
    const gruposList=grupoSnapshot.docs.map(doc=>doc.data());
    gruposList.forEach((grup)=>{
      let lectura:Grupo=grup as Grupo;
        lectura.visitantes.forEach((visit)=>{
          visitantesEnGrupos.push(visit);
        })
    });

    const q = query(usuariosCol,where("activo","==",true));

    const usuariosSnapshot = await getDocs(q);
    const usuariosList=usuariosSnapshot.docs.map(doc=>doc.data());
    usuariosList.forEach((user) => {
      let lectura: Usuario = user as Usuario;
      idUsuariosActivos.push(lectura.identificador);
      usuariosActivos.push(lectura);

    })
    console.log("usuarios Activos ",usuariosActivos);
    const q2 = query(visitantesCol,where("usuario","in",idUsuariosActivos));

    const visitantesSnapshot = await getDocs(q2);
    
    const visitantesList = visitantesSnapshot.docs.map(doc => doc.data());
    
  visitantesList.forEach((visita)=>{

      let lectura:Visitante=visita as Visitante;
     
      visitantesActivos.push(lectura);
           
    
    });
    console.log("visitantes Activos ",visitantesActivos);
    
      
  const nuevo=usuariosActivos.map((elem)=>{

    
    const resultado=visitantesActivos.find(dato=> dato.identificador===elem.identificador);
    console.log("Visitante encontrado ",resultado);
    if (resultado!=null){
      return elem;
    }else{

      elem.identificador="--";
      return elem;

    }

    });
  
    usuariosActivos=nuevo.filter(elem=>elem.identificador != '--');
    

  const usuariosSinGuia=usuariosActivos.map((elem)=>{

    const resultado=visitantesEnGrupos.find(dato=> dato==elem.identificador);
    console.log("Visitante encontrado sin guia ",resultado);
    if (resultado!=null){
      elem.identificador="--"
      return elem;
    }else{
      return elem;

    }



  });
  usuariosActivos=usuariosSinGuia.filter(elem=>elem.identificador != '--');


    console.log("usuarios Activos Visitantes",usuariosActivos);
    return usuariosActivos;
   }

}
