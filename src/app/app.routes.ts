import { Routes, CanActivateFn } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Account } from './pages/account/account';
import { authGuard } from './guards/auth-guard';
import { Users } from './pages/users/users';
import { roleGuard } from './guards/role-guard';
import { RoleC } from './pages/role/role';
import { ForgetPassword } from './pages/forget-password/forget-password';
import { ResetPassword } from './pages/reset-password/reset-password';
import { ChangePassword } from './pages/change-password/change-password';
import { ProductoDetalle } from './pages/producto-detalle/producto-detalle';
import { Carrito } from './pages/carrito/carrito';
import { Proveedores } from './pages/proveedores/proveedores';
import { AboutUs } from './pages/about-us/about-us';
import { CompraProveedorPage } from './pages/compra-proveedor-page/compra-proveedor-page';
import { HisTansacciones } from './pages/his-tansacciones/his-tansacciones';
import { HisCompra } from './pages/his-compra/his-compra';
import { Comments } from './pages/comments/comments';
import { Questions } from './pages/questions/questions';
import { Documentation } from './pages/documentation/documentation';
import { Dashboard } from './pages/dashboard/dashboard';
import { Formulario } from './pages/formulario/formulario';

export const routes: Routes = [
    {
        path:'',
        component:Home,
    },
    {
        path:'login',
        component:Login,
    },
    {
        path:'register',
        component:Register,
    },
    {
        path:'about-us',
        component:AboutUs,
    },
    {
        path:'account/:id',
        component:Account,
        canActivate:[authGuard]
    },
    {
        path:'forget-password',
        component:ForgetPassword,
    },
    {
        path:'reset-password',
        component:ResetPassword,
    },
    {
        path:'questions',
        component:Questions,
    },
    {
        path:'change-password',
        component:ChangePassword,
        canActivate:[authGuard]
    },
    {
        path:'documentation',
        component: Documentation,
        canActivate:[authGuard]
    },
    {
        path: 'producto/:id',
        component: ProductoDetalle,
        canActivate:[authGuard],
    },
    {
        path: 'carrito',
        component: Carrito,
        canActivate:[authGuard],
    },
    {
        path: 'his-compras',
        component: HisCompra,
        canActivate:[authGuard],
    },
    {
        path: 'formulario',
        component: Formulario,
        canActivate:[authGuard],
    },
    {
        path: 'proveedores',
        component: Proveedores,
        canActivate:[authGuard],
        data: {
            roles:['Admin']
        },
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate:[authGuard],
        data: {
            roles:['Admin']
        },
    },
    {
        path: 'his-transacciones',
        component: HisTansacciones,
        canActivate:[authGuard],
        data: {
            roles:['Admin']
        },
    },
    {
        path: 'comments',
        component: Comments,
        canActivate:[authGuard],
        data: {
            roles:['Admin']
        },
    },
    {
        path: 'compra-proveedor-page',
        component: CompraProveedorPage,
        canActivate:[authGuard],
        data: {
            roles:['Admin']
        },
    },
    {
        path:'users',
        component:Users,
        canActivate:[roleGuard],
        data: {
            roles:['Admin']
        },
    },
    {
        path:'roles',
        component:RoleC,
        canActivate:[roleGuard],
        data: {
            roles:['Admin']
        },
    },
];
