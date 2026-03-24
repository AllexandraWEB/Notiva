import { Component } from '@angular/core';
import { LoginForm } from './components/login-form/login-form';
import { DecorativePanel } from './components/decorative-panel/decorative-panel';

@Component({
  selector: 'app-login',
  imports: [LoginForm, DecorativePanel],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}

