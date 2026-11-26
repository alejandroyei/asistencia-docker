import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccesibilidadComponent } from './componentes/accesibilidad/accesibilidad';
import { PerfilUsuario } from './componentes/perfil-usuario/perfil-usuario';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AccesibilidadComponent, PerfilUsuario],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
