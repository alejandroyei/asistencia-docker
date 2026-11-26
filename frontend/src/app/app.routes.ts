import { Routes } from '@angular/router';
import { CrearSesion } from './componentes/crear-sesion/crear-sesion';
import { Auth } from './componentes/auth/auth';
import { Sesiones } from './componentes/sesiones/sesiones';
import { Alumno } from './componentes/alumno/alumno';
import { UnirseGrupo } from './componentes/unirse-grupo/unirse-grupo';
import { AsignarAlumno } from './componentes/asignar-alumno/asignar-alumno';
import { Usuarios } from './componentes/usuarios/usuarios';
import { Asistencia } from './componentes/asistencia/asistencia';
import { CrearAsistencia } from './componentes/crear-asistencia/crear-asistencia';
import { Registrarse } from './componentes/registrarse/registrarse';
import { Grupos } from './componentes/grupos/grupos';
import { Promociones } from './componentes/promociones/promociones';
import { ExplorarGrupos } from './componentes/explorar-grupos/explorar-grupos';
import { roleGuard } from './services/role.guard';

export const routes: Routes = [
    {
        path: '',
        component: Auth
    },
    {
        path: 'auth',
        component: Auth
    },
    {
        path: 'sesiones',
        component: Sesiones, canActivate: [roleGuard], data: { roles: ['admin', 'docente'] }
    },
    {
        path: 'crear-sesion',
        component: CrearSesion, canActivate: [roleGuard], data: { roles: ['admin', 'docente'] }
    },
    {
        path: 'asistencia',
        component: Asistencia, canActivate: [roleGuard], data: { roles: ['admin', 'docente', 'alumno'] }
    },
    {
        path: 'crear-asistencia/:id_group',
        component: CrearAsistencia, canActivate: [roleGuard], data: { roles: ['admin', 'docente'] }
    },
    {
        path: 'registrarse',
        component: Registrarse
    },
    {
        path: 'grupos',
        component: Grupos, canActivate: [roleGuard], data: { roles: ['admin', 'docente'] }
    },
    {
        path: 'promociones',
        component: Promociones, canActivate: [roleGuard], data: { roles: ['admin'] }
    },
    {
        path: 'usuarios',
        component: Usuarios, canActivate: [roleGuard], data: { roles: ['admin'] }
    },
    {
        path: 'alumno',
        component: Alumno, canActivate: [roleGuard], data: { roles: ['alumno'] }
    },
    {
        path: 'unirse-grupo',
        component: UnirseGrupo, canActivate: [roleGuard], data: { roles: ['alumno'] }
    },
    {
        path: 'explorar-grupos',
        component: ExplorarGrupos, canActivate: [roleGuard], data: { roles: ['alumno'] }
    },
    {
        path: 'asignar-alumno',
        component: AsignarAlumno, canActivate: [roleGuard], data: { roles: ['admin'] }
    }
];
