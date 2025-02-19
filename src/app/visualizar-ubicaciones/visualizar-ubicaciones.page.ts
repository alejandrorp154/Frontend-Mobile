import { Component, Input, OnInit } from '@angular/core';
import { Ubicacion } from '../modelos/ubicacion.model';
import { VisualizarUbicacionesService } from '../servicios/visualizar-ubicaciones.service';
import { AuthService } from '../servicios/auth.service';
import { take } from 'rxjs/operators';
import { UserFire } from '../modelos/userFire.model';
import { BehaviorSubject } from 'rxjs';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { PopoverUbicacionesComponent } from '../UI/popover-ubicaciones/popover-ubicaciones.component';
import { UbicacionService } from '../servicios/ubicacion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visualizar-ubicaciones',
  templateUrl: './visualizar-ubicaciones.page.html',
  styleUrls: ['./visualizar-ubicaciones.page.scss'],
})
export class VisualizarUbicacionesPage implements OnInit {

  public ubicaciones:BehaviorSubject<Ubicacion[]> = new BehaviorSubject<Ubicacion[]>([]);
  public id: string;
  public tempUbi: Ubicacion;
  private userFireTemp: UserFire;

  //@Input() id;
  //@Input() nickname;

  public ubicacionClickeada:BehaviorSubject<Ubicacion> = new BehaviorSubject<Ubicacion>(new Ubicacion);
  editando: boolean;
  ubicacion: Ubicacion;

  constructor(private ubicacionService: UbicacionService, public modalController: ModalController,
    public popoverController: PopoverController, private alertCtrl: AlertController,
    private authService: AuthService, private ubicacionesService: VisualizarUbicacionesService
    , private router: ActivatedRoute) {
  }

  async ngOnInit() {
    this.userFireTemp = await this.authService.getCurrentUserFire().toPromise();
    this.router.paramMap.subscribe(
      params => {
          const idPar = params.get('id');
          this.id = idPar;
          this.getAllUbicaciones();
      }
  );
  }

  async getAllUbicaciones(){
    console.log(this.id);
    await this.ubicacionesService.getAllUbicacionesAsync(this.id).then( res =>
      {
        this.ubicaciones.next(res);
      }

    );

  }

  onDeleteUbicacion(idUbicacion: number){
    this.alertCtrl
      .create({
        header: '¿Estas seguro?',
        message: '¿Estas seguro que deseas eliminar esta ubicación?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Borrar',
            cssClass: 'alrtDanger',
            handler: async () => {
              await this.ubicacionService.deleteUbicacion(idUbicacion);
              await this.getAllUbicaciones();
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }



  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverUbicacionesComponent,
      cssClass: 'visualizar-ubicaciones.page.scss',
      event: ev,
      translucent: true,
      componentProps: {ubicaciones: this.ubicaciones, id: this.id, viewingUserId: this.userFireTemp.id},
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();

    try {
      if(data.clicked === "Ver"){
        this.ubicacionClickeada.next(data.value);
        return;
      }

      if(data.clicked === "Borrar"){
        this.onDeleteUbicacion(data.value.idUbicacion);
        this.ubicaciones.next(this.ubicaciones.value.splice(this.ubicaciones.value.findIndex(data.value.idUbicacion), 1));
        return;
      }

      if(data.clicked === "Modificar"){
        this.tempUbi = data.value;
        this.editando = true;
        return;
      }
    } catch (error){}


  }

  marcarUbicacion(ubicacion: Ubicacion) {
  this.tempUbi.latitud = ubicacion.latitud;
  this.tempUbi.longitud = ubicacion.longitud;

    this.alertModificarUbicacion(this.tempUbi).then((result) => {
      this.editando = false;
    });
  }


  alertModificarUbicacion(ubicacion: Ubicacion):Promise<boolean> {
    return new Promise((resolve, reject) => {
      const ctl = this.alertCtrl;
      let alert:any = this.alertCtrl.create({
        header: '¿Estas seguro?',
        message: '¿Estas seguro que deseas modificar esta ubicación?',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              ctl.dismiss().then(() => { resolve(false); });
              return false;
              }
          },
          {
            text: 'Modificar',
            handler: () => {
            ctl.dismiss().then(async() => {
              console.log("tiene:", ubicacion);
              await this.ubicacionService.modificarUbicacion(ubicacion);
              await this.getAllUbicaciones();
              resolve(false);
            });
            return false;
            }
        }]
      }).then((dlg) => dlg.present());
    });
  }

}
