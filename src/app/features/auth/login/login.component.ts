import {Component} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from 'ng-zorro-antd/form';
import {FormsModule} from '@angular/forms';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    NzCardComponent,
    NzFormDirective,
    FormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzInputDirective,
    NzButtonComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    // Implement login logic here
    console.log('Login attempt', this.username, this.password);
  }
}
