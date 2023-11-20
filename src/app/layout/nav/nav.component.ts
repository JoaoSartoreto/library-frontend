import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/shared/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  user: User | null = null;

  constructor(private readonly authService: AuthenticationService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
  }
}
