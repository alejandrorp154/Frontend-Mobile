import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { estadosContactos } from '../modelos/estadosContactos.enum';
import { Evento } from '../modelos/evento.model';
import { Usuario } from '../modelos/usuario.model';
import { AuthService } from '../servicios/auth.service';
import { ChatService } from '../servicios/chat.service';
import { EventoService } from '../servicios/evento.service';
import { Resultado, ToolsService } from '../servicios/tools.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  loggedUser: Usuario;
  eventos: Evento[];
  bsEventos: BehaviorSubject<Evento[]> = new BehaviorSubject([]);
  subscription: Subscription;
  isLoading: boolean = true;


  constructor(private eventoService: EventoService, private usuarioService: UsuarioService, private authService: AuthService, private chatService: ChatService,
    private toolsService: ToolsService, private alertController: AlertController, private router: Router, private location: Location) {

      this.subscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          console.log(event);
          if (event.urlAfterRedirects == '/eventos'){
            this.ngOnInit();
          }
        }
      });

      this.bsEventos.next([]);
      this.eventos = [];
  }

  async ngOnInit() {
    let userFire = await this.authService.getCurrentUserFire().toPromise();
    this.loggedUser = await this.authService.getCurrentUser().toPromise();
    await this.eventoService.obtenerEventosXPersona(userFire.id).then((data) => {
      this.eventos = data;
      this.isLoading = false;
    });
    this.eventos.forEach(e => {e.fechaInicio = new Date(e.fechaInicio); e.fechaFin = new Date(e.fechaFin)});
    this.eventos.sort((a,b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
    this.bsEventos.next(this.eventos.filter(e => e['estadoSolicitud'] != 'cancelada'));
  }


  ngOnDestroy() {
    console.log('salio');
    this.subscription.unsubscribe();
  }

  eliminarAlert(evento: Evento, isDelete:boolean) {
    let message
    let bttnText
    if(isDelete)
    {
      message = '¿Estas seguro que deseas eliminar este evento?'
      bttnText = 'Borrar'
    }
    else
    {
      message = '¿Estas seguro que deseas salir de este evento?'
      bttnText = 'Salir'
    }

    this.alertController
      .create({
        header: '¿Estas seguro?',
        message: message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: bttnText,
            handler: () => {
              if(isDelete)
              {
                this.eliminar(evento);
              }
              else
              {
                this.salirEvento(evento.idEvento);
              }
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  editar(evento: Evento) {
    this.eventoService.eventoActual = evento;
    this.router.navigateByUrl('/evento/editar/' + evento.idEvento);
  }

  ver(evento: Evento) {
    this.eventoService.eventoActual = evento;
    this.router.navigateByUrl('/evento/' + evento.idEvento);
  }

  prueba() {
    console.log(this.location.getState());
  }

  responderSolicitud(evento: Evento, respuesta: string) {
    this.eventoService.responderSolicitud(this.loggedUser.idPersona, evento.idEvento, evento.idChat, respuesta)
      .then(res => {
        evento['estadoSolicitud'] = respuesta;
        this.toolsService.presentToast('Se guardaron los cambios correctamente', Resultado.Ok);
        this.bsEventos.next(this.eventos.filter(e => e['estadoSolicitud'] != 'cancelada'));
      })
      .catch(ex => { console.log(ex); this.toolsService.presentToast('Surgió un error al guardar los cambios', Resultado.Error); });
  }


  async eliminar(evento: Evento) {
    await this.eventoService.elminarEvento(evento.idEvento).then(res => {
      this.chatService.eliminar(evento.idChat);
      console.log(res);
      console.log(this.eventos.findIndex(e => e.idEvento == evento.idEvento));
      console.log(this.eventos);
      this.eventos.splice(this.eventos.findIndex(e => e.idEvento == evento.idEvento),1);
      console.log(this.eventos);
      this.bsEventos.next(this.eventos);
      this.toolsService.presentToast('El evento se eliminó correctamente', Resultado.Ok);
    }).catch(error => {
      this.toolsService.presentToast('Surgió un error al eliminar el evento', Resultado.Error);
    });
  }

  salirEvento(idEvento: number)
  {
    this.eventoService.dejarEvento(idEvento)
  }

}
