import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { Author, MoyabeBlogService, Post } from '../moyabe-blog.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  postData: Post | null = null
  postContent: string | null = null
  constructor(route: ActivatedRoute, public mybs: MoyabeBlogService) { 
    route.params.subscribe(params => {
      this.mybs.Posts.pipe(first()).subscribe(posts => {
        this.postData = posts[params['postId']]
      })
      this.mybs.getPost(params['postId']).subscribe(post => {
        this.postContent = post
      })
    })
  }

}
