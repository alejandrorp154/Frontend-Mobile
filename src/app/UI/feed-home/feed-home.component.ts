import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Publicacion, PublicacionPerfilUsuario } from 'src/app/modelos/perfil';
import { PerfilService } from 'src/app/servicios/perfil.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-feed-home',
  templateUrl: './feed-home.component.html',
  styleUrls: ['./feed-home.component.scss'],
})
export class FeedHomeComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  user = {
    email: '',
    token: '',
    tokenExpirationDate: '',
    userId: ''
  }

  publicacionesAux: PublicacionPerfilUsuario[];
  publicaciones: PublicacionPerfilUsuario[];
  size: number = 10;
  offsize: number = 0;

  constructor(private pubService: PerfilService, private userService: UsuarioService) { }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('_cap_authData'));
    this.publicaciones = await this.pubService.obtenerPublicaciones(this.user.userId,this.size);
  }

  async loadData(event?) {

    this.publicacionesAux = await this.pubService.obtenerPublicaciones(this.user.userId, this.size, event);
    this.publicacionesAux.forEach(element => {
      this.publicaciones.push(element)
    });

  }

  getPublicacionPerfil(ppu: PublicacionPerfilUsuario): Publicacion {
    return {
      idPublicacion: ppu.idPublicacion,
      contenido: ppu.contenido,
      fecha: ppu.fecha,
      tipo: {
          idPublicacion: ppu.tipo.idPublicacion,
          tipo: ppu.tipo.tipo,
      },
      idPersona: ppu.idPersona,
      extension: ppu.extension,
      nombre: ppu.nombre,
      comentarioReacciones: ppu.comentarioReacciones,
      evento: ppu.evento,
      perfil: ppu.perfil,
      cantidadLikes: ppu.cantidadLikes,
      cantidadDislikes: ppu.cantidadDislikes
    };
  }

}
