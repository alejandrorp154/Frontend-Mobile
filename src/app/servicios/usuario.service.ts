import { Multimedia } from "./../modelos/multimedia.model";
import { idPersona } from "./../modelos/publicacion.model";
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserFire } from '../modelos/userFire.model';
import { Usuario } from '../modelos/usuario.model';
import { Contacto, EstadosContactos } from "../modelos/contacto.model";
import { ɵclearResolutionOfComponentResourcesQueue } from "@angular/core";

@Injectable({
  providedIn: 'any'
})
export class UsuarioService {

  readonly estados = {}
  currentlyLoaded: number = 0;

  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods' : 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type,  Accept, x-client-key, x-client-token, x-client-secret, Authorization'
      //Authorization: 'my-auth-token'
    })
  };

  usuarios: Usuario[];
  contactos: Contacto[];

  constructor(private httpClient: HttpClient, private authService: AuthService, @Inject('BASE_URL') private baseUrl: string) { }

   //public async getAllUsuariosAsync(offset: number, size: number): Promise<Usuario[]> {
    public async getAllUsuariosAsync(): Promise<Usuario[]> {
      try {
        const url = `${this.baseUrl}visualizacion/obtenerUsuarios/0/10`;
        let response = await this.httpClient.get(url).toPromise();
        this.usuarios = response as Usuario[];
        return response as Usuario[];
      } catch (error) {
        console.log(error);
      }
    }

  public getAllUsuariosObs(): Observable<Usuario[]> {
    try {
      const url = `${this.baseUrl}visualizacion/obtenerUsuarios/0/5000`;
      return this.httpClient.get<Usuario[]>(url);
    } catch (error) {
      console.log(error);
    }
  }

  public async getAllUsuariosRegistradosAsync(): Promise<Usuario[]> {
    if(!this.authService.usuariosRegistrados || this.authService.usuariosRegistrados.length == 0){

      try {
        const url = `${this.baseUrl}visualizacion/obtenerUsuarios/0/5000`;
        this.authService.usuariosRegistrados = await this.httpClient.get<Usuario[]>(url).toPromise();
        console.log(this.authService.usuariosRegistrados.length);
      } catch (error) {
        console.log(error);
      }
    }

    return new Promise(resolve => resolve(this.authService.usuariosRegistrados));
  }

  getAllUsuarios(){
    return [...this.usuarios];
  }

  getUsuario(idUsuario: string){
    return {...this.usuarios.find(user => {
      return user.idPersona === idUsuario
    })};
  }

  deleteAcount(userID: string)
  {
    try {
      const url = `${this.baseUrl}usuario/${userID}`;
      return this.httpClient.delete(url).toPromise()
    } catch (error) {
      console.log(error);
    }
  }

  addUsuario(idPersona: string, email: string, nombre: string, apellido: string, nickname: string,
    direccion: string, celular: string, pais: string, imagenPerfil: string, nombreImagen: string, extensionImagen: string){

    const url = `${this.baseUrl}usuario/registrarUsuario/`;
    let postData = {
      "idPersona": idPersona,
      "email": email,
      "nombre": nombre,
      "apellido": apellido,
      "nickname": nickname,
      "direccion": direccion,
      "celular": celular,
      "pais": pais,
      "imagenPerfil": imagenPerfil,
      "nombreImagen": nombreImagen,
      "extensionImagen": extensionImagen
    }
    return this.httpClient.post<Usuario>(url, postData, this.httpOptions)
    .subscribe(data => {
      console.log(data['_body']);
     }, error => {
      console.log(error);
    });
  }

  deleteUsuario(idUsuario: string){
    this.usuarios = this.usuarios.filter(user => {
      return user.idPersona !== idUsuario;
    })
  }

  deleteUsuarioAdmin(idUsuario:string)
  {
    const url = `${this.baseUrl}usuario/bajaAdmin/${idUsuario}`;
    return this.httpClient.delete(url);
  }

  async bloquearUsuario(idUsuario: string){
    const url = `${this.baseUrl}usuario/${idUsuario}`;
    let response = this.httpClient.put<Usuario>(url, null).toPromise().catch(error => console.log(error));
    return response;
  }
  async desbloquearUsuario(idUsuario: string){
    const url = `${this.baseUrl}usuario/desbloquearUsuario/${idUsuario}`;
    let response = this.httpClient.put<Usuario>(url, null).toPromise().catch(error => console.log(error));
    console.log(response);
    return response;
  }

  getContactos(idUsuario: string, size: number, event?): Promise<Usuario[]> {
    let response = this.httpClient.get<Usuario[]>(this.baseUrl + `visualizacion/obtenerAmigos/${idUsuario}/${this.currentlyLoaded}/${size}`).toPromise();
    if(this.currentlyLoaded === 0){ this.currentlyLoaded += size}
    if(event)
    {
      event.target.complete();
      this.currentlyLoaded += size;
      response.then( data => {
        if (data.length == 0) {
          event.target.disabled = true;
        }
      })
    }
    return response;
  }

  public async getContactosAsync(idPersona: string) {
    try{
      const url = this.baseUrl + 'visualizacion/obtenerAmigos/' + idPersona +'/10/10';
      let response = await this.httpClient.get(url).toPromise();
      this.contactos = response as Contacto[];
      return response as Contacto[];
    }
    catch(error){
      console.log(error)
    }

  }

  public getAmigosAsync(idPersona: string): Promise<Usuario[]> {
    console.log(this.baseUrl + 'visualizacion/obtenerAmigos/' + idPersona +'/0/100');
    return this.httpClient.get<Usuario[]>(this.baseUrl + 'visualizacion/obtenerAmigos/' + idPersona +'/0/100').toPromise();
  }

  public getSolicitudesPendientes(idPersona): Promise<Usuario[]>{
    try{
      const url = `${this.baseUrl}visualizacion/solicitudPendiente/${idPersona}/0/10`;
      return this.httpClient.get<Usuario[]>(url).toPromise();
    }catch(error){
      console.log(error);
    }
  }

  getLoggedUser(): Promise<Usuario> {
    return new Promise(async (resolve) => {
      let userFire = await this.authService.getCurrentUserFire().toPromise();
      resolve(this.getUsuario(userFire.id));
    });
  }


  getUsuarioAsync(idPersona: string): Promise<Usuario> {
    return this.httpClient.get<Usuario>(this.baseUrl + 'usuario/' + idPersona).toPromise();
  }

  async agregarContacto(idPersona1: string, idPersona2: string){
    const url = `${this.baseUrl}usuario/agregarContacto/${idPersona1}/${idPersona2}`;
    let response = this.httpClient.post<Usuario>(url, null).toPromise().catch(error => console.log(error));
    console.log(response);
    return response;
  }

  async respuestaContacto(idPersona: string, idPersonaContacto: string, estado: EstadosContactos){
    let json = {
      "idPersona" : idPersonaContacto,
      "contactoIdPersona" : idPersona,
      "estadoContactos" : EstadosContactos[estado]
    };
    const url = `${this.baseUrl}usuario/respuestaContacto`;
    let response = this.httpClient.put<Contacto>(url, json).toPromise().catch(error => console.log(error));
    return response;
  }

  async subirFoto(mult: Multimedia){
    let json = {
      "contenido" : mult.contenido,
      "nombre" : mult.nombre,
      "extension" : mult.extension,
      "idPersona" : mult.idPersona
    };
    console.log(json);
    const url = `${this.baseUrl}usuario/subirFoto`;
    let response = this.httpClient.post<Multimedia>(url, json).toPromise().catch(error => console.log(error));
    return response;
  }

  async bajaContacto(idPersona1: string, idPersona2: string){
    const url = `${this.baseUrl}usuario/bajaContacto/${idPersona1}/${idPersona2}`;
    let response = this.httpClient.delete<Usuario>(url).toPromise().catch(error => console.log(error));
    console.log(response);
    return response;
  }

  async tieneSolicitudPendiente(userLogueado: string, idPerfil: string) {

      const url = `${this.baseUrl}usuario/sonAmigos/${userLogueado}/${idPerfil}`;
      return this.httpClient.get<boolean>(url).toPromise();
  }

}
