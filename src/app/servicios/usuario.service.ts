import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Persona, Rol } from '../modelos/persona.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserFire } from '../modelos/userFire.model';
import { Usuario } from '../modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  readonly estados = {}


  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods' : 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type,  Accept, x-client-key, x-client-token, x-client-secret, Authorization'
      //Authorization: 'my-auth-token'
    })
  };

  // private usuarios: Persona[] = [
  //   {
  //     nombre: 'Alejandro',
  //     apellido: 'Rodriguez',
  //     email: 'email@mail.com',
  //     imgUrl: "",
  //     nickname: 'aleuy',
  //     idPersona: '1',
  //     rol: Rol.Administrador,
  //     sexo: "Masculino",
  //     bloqueado: false
  //   },
  //   {
  //     nombre: 'Leo',
  //     apellido: 'Messi',
  //     email: 'messi@mail.com',
  //     imgUrl: "",
  //     nickname: 'leomessi',
  //     idPersona: '2',
  //     rol: Rol.Turista,
  //     sexo: "No sabe",
  //     bloqueado: false
  //   }
  // ]

  usuarios: Persona[];

  constructor(private httpClient: HttpClient, private authService: AuthService, @Inject('BASE_URL') private baseUrl: string) { }

   //public async getAllUsuariosAsync(offset: number, size: number): Promise<Usuario[]> {
    public async getAllUsuariosAsync(): Promise<Persona[]> {
      try {
        const url = `${this.baseUrl}visualizacion/obtenerUsuarios/0/10`;
        let response = await this.httpClient.get(url).toPromise();
        this.usuarios = response as Persona[];
        return response as Persona[];
      } catch (error) {
        console.log(error);
      }
    }

  public getAllUsuariosObs(): Observable<Persona[]> {
    try {
      const url = `${this.baseUrl}visualizacion/obtenerUsuarios/0/10`;
      return this.httpClient.get<Persona[]>(url);
    } catch (error) {
      console.log(error);
    }
  }

  getAllUsuarios(){
    return [...this.usuarios];
  }

  getUsuario(idUsuario: string){
    return {...this.usuarios.find(user => {
      return user.idPersona === idUsuario
    })};
  }

  // addUsuario(idPersona: string, nombre: string, apellido: string, email: string, imgUrl: string, nickname: string, passphrase: string, rol: Rol, sexo: string){
  //   const nuevoUsuario: Persona = {idPersona, nombre, apellido, email, imgUrl, nickname, rol, sexo};
  //   //hacer el http put
  //   this.usuarios.push(nuevoUsuario);
  // }

  addUsuario(idPersona: string, email: string, nombre: string, apellido: string, nickname: string,
    direccion: string, celular: string, pais: string, imagenPerfil: string, nombreImagen: string, extensionImagen: string){
    //hacer el http put
    // this.usuarios.push(nuevoUsuario);

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
    return this.httpClient.post<Persona>(url, postData, this.httpOptions)
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

  async bloquearUsuario(idUsuario: string){
    let json = {"idPersona": idUsuario};
    const url = `${this.baseUrl}usuario/bloquearUsuario/${idUsuario}`;
    this.httpClient.put<Usuario>(url, json, this.httpOptions)
    .subscribe(data => {
      console.log(data['_body']);
     }, error => {
      console.log(error);
    });
  }
  async desbloquearUsuario(idUsuario: string){
    let json = {"idPersona": idUsuario};
    const url = `${this.baseUrl}usuario/desbloquearUsuario/${idUsuario}`;
    this.httpClient.put<Usuario>(url, json, this.httpOptions)
    .subscribe(data => {
      console.log(data['_body']);
     }, error => {
      console.log(error);
    });
  }

  getContactos(idUsuario: string): Promise<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.baseUrl + 'visualizacion/obtenerAmigos/' + idUsuario).toPromise();
  }

  getLoggedUser(): Promise<Persona> {
    return new Promise(async (resolve) => {
      let userFire = await this.authService.getCurrentUserFire().toPromise();
      resolve(this.getUsuario(userFire.id));
    });
  }

  getUsuarioAsync(idPersona: string): Promise<Persona> {
    console.log(this.baseUrl + 'usuario/' + idPersona);
    return this.httpClient.get<Persona>(this.baseUrl + 'usuario/' + idPersona).toPromise();
  }

}
