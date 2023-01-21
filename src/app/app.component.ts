import { AfterContentChecked, AfterViewInit, Component } from '@angular/core';
import { MoyabeBlogService } from './moyabe-blog.service';
import { Meta, Title } from '@angular/platform-browser';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { fade } from './fade.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fade]
})
export class AppComponent {
  loaderFade = 'in'
  contentFade = 'out'
  constructor(
    public mybs: MoyabeBlogService,
    private meta: Meta,
    private title: Title
  ) {
    this.mybs.Settings.subscribe(settings => {
      this.title.setTitle(settings.title)
      this.meta.addTag({ name: 'description', content: settings.description })
      this.loaderFade = 'out'
      this.contentFade = 'in'
    })
  }
}
