import { Component } from '@angular/core';
import { MoyabeBlogService } from './moyabe-blog.service';
import { Meta, Title } from '@angular/platform-browser';  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public mybs: MoyabeBlogService,
    private meta: Meta,
    private title: Title
    ) { 
      this.mybs.Settings.subscribe(settings => {
        this.title.setTitle(settings.title)
        this.meta.addTag(  { name: 'description', content: settings.description })
      })
    }
}
