import { Component } from '@angular/core';
import { RegisterForm } from './components/register-form/register-form';
import { DecorativePanel } from './components/decorative-panel/decorative-panel';

@Component({
  selector: 'app-register',
  imports: [RegisterForm, DecorativePanel],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {}

