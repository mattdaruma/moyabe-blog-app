import { Component, Input } from '@angular/core';
import { Authors, MoyabeBlogService, Post } from 'src/app/moyabe-blog.service';

@Component({
  selector: 'app-feed-cards',
  templateUrl: './feed-cards.component.html',
  styleUrls: ['./feed-cards.component.scss']
})
export class FeedCardsComponent {
  @Input() posts: Post[] = []
  @Input() authors: Authors = {}
  constructor(public mybs: MoyabeBlogService){}
}
