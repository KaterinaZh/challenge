import {Component} from '@angular/core';
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'challenge';
  public isLightTheme: boolean = false;

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.isLightTheme = this.userService.getTheme() !== 'dark';
    this.updateThemeBody();
  }

  public onThemeSwitchChange() {
    this.isLightTheme = !this.isLightTheme;
    this.userService.setTheme(this.isLightTheme);
    this.updateThemeBody();
  }

  private updateThemeBody() {
    document.body.setAttribute(
      'data-theme',
      this.isLightTheme ? 'light' : 'dark'
    );
  }
}
