import { AfterContentInit, AfterViewInit, Component, HostListener } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NavigationEnd, Router } from '@angular/router';
import { expand, first } from 'rxjs';
import { Authors, MoyabeBlogService, Post, Settings } from '../moyabe-blog.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements AfterContentInit {
  scrollTimer: NodeJS.Timeout | null = null
  @HostListener('window:scroll', ['$event']) scrollEvent(event: any){
    if(this.scrollTimer) return
    this.scrollTimer = setTimeout(()=>{
      this.mybs.FeedScrollY = window.scrollY
      this.scrollTimer = null
    }, 500)
  }
  private posts: Post[] = []
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
  ngAfterContentInit(): void {
    window.scroll({ 
      top: this.mybs.FeedScrollY
    })
  }
  updateDisplaySetting(settingName: string){
    let newSettings = JSON.parse(JSON.stringify(this.settings)) as any
    newSettings[settingName] = !newSettings[settingName]
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
      if(settings.filterAuthorsInclude.length > 0) filteredPosts = filteredPosts.filter(post => {
        let hasAnyAuthor = false
        for(let authorId of settings.filterAuthorsInclude){
          if(post.author === authorId){
            hasAnyAuthor = true
            break
          }
        }
        return hasAnyAuthor
      })
      if(settings.filterAuthorsExclude.length > 0) filteredPosts = filteredPosts.filter(post => {
        let hasAnyAuthor = false
        for(let authorId of settings.filterAuthorsExclude){
          if(post.author === authorId){
            hasAnyAuthor = true
            break
          }
        }
        return !hasAnyAuthor
      })
      if(settings.filterTagsInclude.length > 0) filteredPosts = filteredPosts.filter(post => {
        let hasAnyTag = false
        for(let tag of settings.filterTagsInclude){
          if(post.tags.includes(tag)){
            hasAnyTag = true
            break
          }
        }
        return hasAnyTag
      })
      if(settings.filterTagsExclude.length > 0) filteredPosts = filteredPosts.filter(post => {
        let hasAnyTag = false
        for(let tag of settings.filterTagsExclude){
          if(post.tags.includes(tag)){
            hasAnyTag = true
            break
          }
        }
        return !hasAnyTag
      })
      for(let i = 0; i < settings.sortOrder.length; i++){
        let topic = settings.sortOrder[settings.sortOrder.length - 1 - i]
        switch(topic){
          case 'date': {
            let direction = settings.sortDate
            if(direction !== 0) filteredPosts.sort((a,b)=>{
              return a.addedDate > b.addedDate ? direction : -direction
            })
            break
          }
          case 'title': {
            let direction = settings.sortTitle
            if(direction !== 0) filteredPosts.sort((a,b)=>{
              if(a.title === b.title) return 0
              return a.title > b.title ? direction : -direction
            })
            break
          }
          case 'author': {
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
