import { Persona } from "./../modelos/persona.model";
import { Usuario } from "src/app/modelos/usuario.model";
import { UsuarioService } from "./../servicios/usuario.service";
import { Component, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, IonList } from "@ionic/angular";
import { AuthService } from "../servicios/auth.service";
import { UserFire } from '../modelos/userFire.model';
import { Observable } from "rxjs";

@Component({
  selector: 'app-tab-gestion-usuarios',
  templateUrl: './tab-gestion-usuarios.page.html',
  styleUrls: ['./tab-gestion-usuarios.page.scss'],
})
export class TabGestionUsuariosPage implements OnInit {

  usuarios: Persona[];
  user: Usuario;
  showError: boolean;
  errorMessage: string;
  userFire: UserFire;

  constructor(private usuarioService: UsuarioService, private alertCtrl: AlertController, private authService: AuthService) { }

  ngOnInit() {
    this.getAllUsuarios();
  }

  ionViewDidEnter(){
  }

  async getAllUsuarios(){
    this.usuarios = await this.usuarioService.getAllUsuariosAsync();
  }

  onBloquearUsuario(idPersona: string, slidingUser: IonItemSliding){
    try{
      this.alertCtrl
      .create({
        header: 'Bloquear Usuario',
        message: '¿Estas seguro que deseas bloquear este usuario?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Bloquear',
            handler: async () => {
              await this.usuarioService.bloquearUsuario(idPersona);
              await this.getAllUsuarios();
              this.showError = false;
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
    }catch(error){
      console.log(error);
    }
  }

  getContactosPersona

  onDesbloquearUsuario(idPersona: string, slidingUser: IonItemSliding){
    try{
      this.alertCtrl
      .create({
        header: 'Desbloquear Usuario',
        message: '¿Estas seguro que deseas desbloquear este usuario?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Desbloquear',
            handler: async () => {
              await this.usuarioService.desbloquearUsuario(idPersona);
              //await slidingUser.close();
              await this.getAllUsuarios();
              this.showError = false;
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
    }catch(error){
      console.log(error);
    }
  }

  onBorrarCuentaPropia()
  {
    this.alertCtrl
    .create({
      header: 'Eliminar cuenta',
      message: 'Esta a punto de borrar permanentemente su cuenta. ¿Seguro que desea continuar?',
      buttons: [
        {
          text: 'Eliminar',
          handler: async () => {
            this.userFire = await this.authService.getCurrentUserFire().toPromise()
                console.log(this.userFire)
                  let obs: Observable<any>;
                  obs = this.authService.deleteAccount(this.userFire.token);

                  obs.subscribe(
                    errorResponse => {
                      //const code = errorResponse.error.error.message;
                      console.log(errorResponse)
                    }
                  )
                  this.usuarioService.deleteUsuarioAdmin(this.userFire.id)
                  this.authService.logout();
          },
          cssClass: 'alrtDanger'
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        }
      ]
    })
    .then(alertEl => alertEl.present());
  }
}
