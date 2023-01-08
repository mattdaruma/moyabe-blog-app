import { Component, Input } from '@angular/core';
import { Authors, MoyabeBlogService, Post } from 'src/app/moyabe-blog.service';

@Component({
  selector: 'app-feed-table',
  templateUrl: './feed-table.component.html',
  styleUrls: ['./feed-table.component.scss']
})
export class FeedTableComponent {
  @Input() posts: Post[] = []
  @Input() authors: Authors = {}
  constructor(public mybs: MoyabeBlogService){}
}
