import { Timestamp } from "firebase/firestore/lite";

export interface Usuario {
    identificador:string,
    apellido:string,
    nombre:string,
    domicilio:string, 
    ciudad:string,
    telefono:string,
    activo:boolean
}

export interface Guia{

    identificador:string,
    usuario: string,
    cuil: string,
    nroHabiliatacion: number,
    fHabilitacion: Date,
    vtoHabilitacion:Date,
    email:string,
    password:string

}

export interface Administrador{
    identificador:string,
    usuario:string,
    cargo:string,
    email:string,
    password:string
}

export interface Visitante{
    identificador:string,
    usuario:string,
    pais:string,
    provincia:string
}

export interface Ubicacion{
    identificador:string,
    latitud:number,
    longitud:number,
    fechaHora:Date,
    usuario:string
}

export interface Publicacion{
    identificador:string,
    titulo:string,
    cuerpo:string,
    urlImagen:string,
    fechaCreacion:Timestamp, 
    fechaVto: Date,
    creador:string,
    
}

export interface Mensaje{
    identificador:string,
    mensaje:string,
    remitente:string,
    fechaEnvio:Date,
    ultimaUbicacion:string
}

export interface Grupo{
    identificador:string,
    fechaCreacion:Date,
    recorrido:string,
    guiaResponsable:string,
    visitantes:string[],
    activo:boolean

}

export interface Marker{
    position: {
        lat: number,
        lng: number,
    
    };
    title: string,
    label: string
}