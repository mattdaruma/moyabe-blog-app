import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime, first, map, Observable, startWith } from 'rxjs';
import { Author, Authors, MoyabeBlogService, Settings } from 'src/app/moyabe-blog.service';

@Component({
  selector: 'app-feed-settings',
  templateUrl: './feed-settings.component.html',
  styleUrls: ['./feed-settings.component.scss']
})
export class FeedSettingsComponent {
  _settings: Settings = {} as Settings
  settingsForm = new FormGroup({
    filters: new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      before: new FormControl<Date | null>(null),
      after: new FormControl<Date | null>(null),
      authors: new FormGroup({
        include: new FormControl(''),
        exclude: new FormControl(''),
      }),
      tags: new FormGroup({
        include: new FormControl(''),
        exclude: new FormControl(''),
      })
    }),
    sort: new FormGroup({
      date: new FormControl<number>(0),
      title: new FormControl<number>(0),
      author: new FormControl<number>(0)
    }),
    display: new FormGroup({
      feed: new FormControl(''),
      fields: new FormControl<string[]>([])
    })
  })
  authors = {} as Authors
  authorsArray = [] as Author[]
  includedAuthors = [] as Author[]
  filteredIncludedAuthors: Observable<Author[]>
  excludedAuthors = [] as string[]
  filteredExcludedAuthors = [] as string[]
  includedTags = [] as string[]
  filteredIncludedTags = [] as string[]
  excludedTags = [] as string[]
  filteredExcludedTags = [] as string[]
  private autocompleteListSize = 10
  constructor(public mybs: MoyabeBlogService) {
    this.filteredIncludedAuthors = this.settingsForm.get('filters.authors.include')!.valueChanges.pipe(
      startWith(null),
      map((authorSearch: string | null) => (
        authorSearch 
        ? this.authorsArray.filter(author => 
          author.displayName.toLowerCase().startsWith(authorSearch)).slice(0, this.autocompleteListSize
          ) 
        : this.authorsArray.slice(0, this.autocompleteListSize))),
    )
    this.mybs.Settings.subscribe(settings => {
      this._settings.expandDisplay = settings.expandDisplay
      this._settings.expandFilters = settings.expandFilters
      this._settings.expandSettings = settings.expandSettings
      this._settings.expandSort = settings.expandSort
    })
    this.mybs.Authors.subscribe(authors => {
      this.authors = authors
      let authorsArray = []
      for(let authorId in authors){
        authors[authorId].authorId = authorId
        authorsArray.push(authors[authorId])
      }
      this.authorsArray = authorsArray
      this.settingsForm.get('filters.authors.include')?.setValue(null)
    })
    this.mybs.Settings.pipe(
      first()
    ).subscribe(newSettings => {
      this.setForm(newSettings)
      this._settings = Object.assign(this._settings, newSettings) as Settings
      this.settingsForm.get('display')?.valueChanges
      .pipe(debounceTime(100))
      .subscribe(newDisplay => {
        this._settings.displayFeed = newDisplay.feed ?? 'list'
        this._settings.displayFields = newDisplay.fields ?? ['title']
        this.mybs.Settings.next(this._settings)
        this.mybs.UpdateList.next(true)
      })
      this.settingsForm.get('filters')?.valueChanges
      .pipe(debounceTime(100))
      .subscribe(newFilters => {
        this._settings.filterBefore = newFilters.before?.getTime() ?? null
        this._settings.filterAfter = newFilters.after?.getTime() ?? null
        this._settings.filterTitle = newFilters.title ?? null
        this._settings.filterDescription = newFilters.description ?? null
        this.mybs.Settings.next(this._settings)
        this.mybs.UpdateList.next(true)
      })
      this.settingsForm.get('sort')?.valueChanges
      .pipe(debounceTime(100))
      .subscribe(newSort => {
        let newSortOrder = []
        if(this._settings.sortDate != newSort.date) newSortOrder.push('Date')
        if(this._settings.sortTitle != newSort.title) newSortOrder.push('Title')
        if(this._settings.sortAuthor != newSort.author) newSortOrder.push('Author')
        for(let topic of this._settings.sortOrder){
          if(!newSortOrder.includes(topic)) newSortOrder.push(topic)
        }
        this._settings.sortOrder = newSortOrder
        this._settings.sortDate = newSort.date ?? 0
        this._settings.sortTitle = newSort.title ?? 0
        this._settings.sortAuthor = newSort.author ?? 0
        this.mybs.Settings.next(this._settings)
        this.mybs.UpdateList.next(true)
      })
    })
  }
  setForm(settings: Settings){
    this.settingsForm.get('filters.title')?.setValue(settings.filterTitle)
    this.settingsForm.get('filters.description')?.setValue(settings.filterDescription)
    this.settingsForm.get('display.feed')?.setValue(settings.displayFeed)
    this.settingsForm.get('display.fields')?.setValue(settings.displayFields)
    this.settingsForm.get('sort.date')?.setValue(settings.sortDate)
    this.settingsForm.get('sort.title')?.setValue(settings.sortTitle)
    this.settingsForm.get('sort.author')?.setValue(settings.sortAuthor)
  }
  restoreDefaults(){
    this._settings.expandDisplay = this.mybs.WebSettings.expandDisplay
    this._settings.expandFilters = this.mybs.WebSettings.expandFilters
    this._settings.expandSettings = this.mybs.WebSettings.expandSettings
    this._settings.expandSort = this.mybs.WebSettings.expandSort
    this.setForm(this.mybs.WebSettings)
  }
  panelExpanded(settingName: string) {
    if (settingName === 'display') this._settings.expandDisplay = true
    if (settingName === 'filters') this._settings.expandFilters = true
    if (settingName === 'settings') this._settings.expandSettings = true
    if (settingName === 'sort') this._settings.expandSort = true
    this.mybs.Settings.next(this._settings)
  }
  panelCollapsed(settingName: string) {
    if (settingName === 'display') this._settings.expandDisplay = false
    if (settingName === 'filters') this._settings.expandFilters = false
    if (settingName === 'settings') this._settings.expandSettings = false
    if (settingName === 'sort') this._settings.expandSort = false
    this.mybs.Settings.next(this._settings)
  }
  addIncludedAuthor(author: Author){
    if(this.includedAuthors.some(included => included.authorId === author.authorId)) return
    this.settingsForm.get('filters.authors.include')?.setValue('')
    this.includedAuthors.push(author)
  }
  removeIncludedAuthor(author: Author){
    if(!this.includedAuthors.some(included => included.authorId === author.authorId)) return
    this.includedAuthors.splice(this.includedAuthors.findIndex(included => included.authorId === author.authorId), 1)
  }
  clearFilters() {
    if(
      this.settingsForm.value.filters?.title !== null ||
      this.settingsForm.value.filters?.description !== null ||
      this.settingsForm.value.filters?.before !== null ||
      this.settingsForm.value.filters?.after !== null 
      ){
        this.settingsForm.get('filters.title')?.setValue(null)
        this.settingsForm.get('filters.description')?.setValue(null)
        this.settingsForm.get('filters.before')?.setValue(null)
        this.settingsForm.get('filters.after')?.setValue(null)
      }
  }
}
