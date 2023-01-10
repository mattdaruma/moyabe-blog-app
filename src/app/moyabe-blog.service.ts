import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { first, map, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoyabeBlogService {
  public Posts: Observable<Posts>
  public Authors: Observable<Authors>
  public WebSettings = {} as Settings
  public Settings = new ReplaySubject<Settings>(1)
  public UpdateList = new Subject<boolean>()
  private _settingsCachePath = 'moyabe-blog-settings'
  public get LocalSettings(): Settings | null {
    let settingsCache = localStorage.getItem(this._settingsCachePath)
    if(settingsCache === null) return null
    return JSON.parse(settingsCache)
  }
  public set LocalSettings(settings: Settings | null){
    if(settings === null) localStorage.removeItem(this._settingsCachePath)
    else localStorage.setItem(this._settingsCachePath, JSON.stringify(settings))
  }
  constructor(private http: HttpClient) { 
    this.Settings.subscribe(newSettings => {
      this.LocalSettings = newSettings
    })
    this.Authors = this.http.get<Authors>('/assets/authors/index.json')
    this.Posts = this.http.get<Posts>('/assets/posts/index.json')
    if(this.LocalSettings !== null) console.warn('USED LOCAL')
    if(this.LocalSettings !== null) this.Settings.next(this.LocalSettings)
    this.http.get<Settings>('/assets/settings.json').pipe(first()).subscribe(settings => {
      this.WebSettings = settings
      if(this.LocalSettings === null) console.warn('USED WEB SETTINGS')
      if(this.LocalSettings === null) this.Settings.next(settings)
    })
  }
  getPost(postId: string){
    return this.http.get(`/assets/posts/${postId}/post.md`, {responseType: 'text' })
  }
}

export interface Authors {
  [propName: string]: Author
}
export interface Author {
  authorId: string;
  displayName: string;
  catchPhrase: string;
  avatar: string;
  addedDate: number;
}
export interface Posts {
  [propName: string]: Post
}
export interface Post {
  postId: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  addedDate: number;
  cover: string;
  images: PostImage[];
}
export interface PostImage {
  fileName: string;
  title: string;
  description: string;
  addedDate: number;
}

type SettingsKeys = 'title' | 'description' | 'displayFeed'

export interface Settings {
  title: string;
  description: string;
  displayViewOptions: boolean;
  displaySortOptions: boolean;
  displayFilterOptions: boolean;
  displayResetButtons: boolean;
  displayAuthorOptions: boolean,
  displayTagOptions: boolean,
  filterTitle: string | null;
  filterDescription: string | null;
  filterAfter: number | null;
  filterBefore: number | null;
  filterAuthorsInclude: string[];
  filterAuthorsExclude: string[];
  filterTagsInclude: string[];
  filterTagsExclude: string[];
  sortDate: number;
  sortTitle: number;
  sortAuthor: number;
  sortOrder: string[];
  displayFeed: string;
  displayFields: string[];
}