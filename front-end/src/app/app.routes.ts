import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SobreComponent } from './pages/sobre/sobre.component';
import { SolucaoComponent } from './pages/solucao/solucao.component';
import { SucessoComponent } from './pages/sucesso/sucesso.component';
import { ParceirosComponent } from './pages/parceiros/parceiros.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';
import { CadastroBenComponent } from './pages/cadastro-ben/cadastro-ben.component';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "sobre",
    component: SobreComponent
  },
  {
    path: "solucao",
    component: SolucaoComponent
  },
  {
    path: "sucesso",
    component: SucessoComponent
  },
  {
    path: "parceiros",
    component: ParceirosComponent
  },
  {
    path: "cadastro",
    component: CadastroComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "cadastro-ben",
    component: CadastroBenComponent
  },

];
