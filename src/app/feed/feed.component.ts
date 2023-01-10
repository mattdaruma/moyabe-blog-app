import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { expand, first } from 'rxjs';
import { Authors, MoyabeBlogService, Post, Settings } from '../moyabe-blog.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {
  posts: Post[] = []
  filteredPosts: Post[] = []
  pagedPosts: Post[] = []
  pageSize: number = 10
  pageIndex: number = 0
  authors: Authors = {}
  settings: Settings | null = null
  constructor(public mybs: MoyabeBlogService) { 
    this.mybs.Authors.subscribe(authors => {
      this.authors = authors
    })
    this.mybs.Posts.subscribe(posts => {
      let postArray = []
      for(let postId in posts){
        posts[postId].postId = postId
        postArray.push(posts[postId])
      }
      this.posts = postArray
      this.applySettings()
    })
    this.mybs.UpdateList.subscribe(update => {
      if(update) this.applySettings()
    })
    this.mybs.Settings.subscribe(settings => {
      this.settings = settings
    })
  }
  updateDisplaySetting(settingName: string){
    let newSettings = JSON.parse(JSON.stringify(this.settings)) as any
    newSettings[settingName] = !newSettings[settingName]
    console.warn('SETING UPDATE')
    this.mybs.Settings.next(newSettings)
  }
  applySettings(){
    this.mybs.Settings.pipe(first()).subscribe(settings => {
      let filteredPosts = JSON.parse(JSON.stringify(this.posts)) as Post[]
      if(settings.filterAfter !== null) filteredPosts = filteredPosts.filter(post =>  {
        return post.addedDate > settings.filterAfter!
      })
      if(settings.filterBefore !== null) filteredPosts = filteredPosts.filter(post =>  {
        return post.addedDate < settings.filterBefore!
      })
      if(settings.filterTitle !== null) filteredPosts = filteredPosts.filter(post =>  {
        return post.title.toLowerCase().includes(settings.filterTitle!)
      })
      if(settings.filterDescription !== null) filteredPosts = filteredPosts.filter(post =>  {
        return post.description.toLowerCase().includes(settings.filterDescription!)
      })
      for(let i = 0; i < settings.sortOrder.length; i++){
        let topic = settings.sortOrder[settings.sortOrder.length - 1 - i]
        switch(topic){
          case 'Date': {
            let direction = settings.sortDate
            if(direction !== 0) filteredPosts.sort((a,b)=>{
              return a.addedDate > b.addedDate ? direction : -direction
            })
            break
          }
          case 'Title': {
            let direction = settings.sortTitle
            if(direction !== 0) filteredPosts.sort((a,b)=>{
              if(a.title === b.title) return 0
              return a.title > b.title ? direction : -direction
            })
            break
          }
          case 'Author': {
            let direction = settings.sortAuthor
            if(direction !== 0) filteredPosts.sort((a,b)=>{
              if(this.authors[a.author].displayName === this.authors[b.author].displayName) return 0
              return this.authors[a.author].displayName > this.authors[b.author].displayName ? direction : -direction
            })
            break
          }
        }
      }
      this.pageIndex = 0
      this.filteredPosts = filteredPosts
      this.applyPaging()
    })
  }
  applyPaging(){
    this.pagedPosts = this.filteredPosts.slice(this.pageSize*this.pageIndex, this.pageSize*this.pageIndex+this.pageSize)
  }
  pageChange(e: PageEvent) {
    this.pageIndex = e.pageIndex
    this.applyPaging()
  }
}
