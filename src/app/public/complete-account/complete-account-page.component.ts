import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserInfo } from '@interfaces/users.interface';
import { AuthService } from '@core/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '@core/validators/custom-validators';

@Component({
  templateUrl: './complete-account-page.component.html',
  styleUrls: ['./complete-account-page.component.scss']
})
export class CompleteAccountPageContainerComponent implements OnInit {
  public activeForm = new FormGroup({
    fullname: new FormControl(),
    email: new FormControl(),
    username: new FormControl(),
    phone: new FormControl(),
    confirmPassword: new FormControl(),
    password: new FormControl()
  });
  user!: IUserInfo;
  public imgLogo = '/assets/images/logo.png';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  get f(): any {
    return this.activeForm.controls;
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params.token;
      if (!token) {
        this.router.navigate(['/not-found']);
      }
    });
  }

  onSubmit(): void {
    if (this.activeForm.invalid) {
      return;
    }
    const formValue = this.activeForm?.value;
    const dataPost: any = {
      userId: this.user.id,
      fullname: formValue.fullname,
      password: formValue.password
    };
  }
}
