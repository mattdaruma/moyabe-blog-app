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
  settings: Settings | null = null
  settingsForm = new FormGroup({
    filters: new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      before: new FormControl<Date | null>(null),
      after: new FormControl<Date | null>(null)
    })
  })
  tags: string[] = []
  authors: Authors | null = null
  authorsArray = [] as Author[]
  includedAuthorsControl = new FormControl('')
  filteredIncludedAuthors: Observable<Author[]>
  excludedAuthorsControl = new FormControl('')
  filteredExcludedAuthors: Observable<Author[]>
  includedTagsControl = new FormControl('')
  filteredIncludedTags: Observable<string[]>
  excludedTagsControl = new FormControl('')
  filteredExcludedTags: Observable<string[]>
  private autocompleteListSize = 10
  firstLoad = true;
  constructor(public mybs: MoyabeBlogService) {
    this.filteredIncludedAuthors = this.includedAuthorsControl.valueChanges.pipe(
      startWith(null),
      map((authorSearch: string | null) => (
        authorSearch
          ? this.authorsArray.filter(author =>
            author.displayName.toLowerCase().startsWith(authorSearch))
            .slice(0, this.autocompleteListSize)
          : this.authorsArray.slice(0, this.autocompleteListSize)))
    )
    this.filteredExcludedAuthors = this.excludedAuthorsControl.valueChanges.pipe(
      startWith(null),
      map((authorSearch: string | null) => (
        authorSearch
          ? this.authorsArray.filter(author =>
            author.displayName.toLowerCase().startsWith(authorSearch))
            .slice(0, this.autocompleteListSize)
          : this.authorsArray.slice(0, this.autocompleteListSize)))
    )
    this.filteredIncludedTags = this.includedTagsControl.valueChanges.pipe(
      startWith(null),
      map((tagSearch: string | null) => {
        if (tagSearch === null || tagSearch === '') return this.tags.slice(0, this.autocompleteListSize)
        return this.tags.filter(tag => tag.startsWith(tagSearch)).slice(0, this.autocompleteListSize)
      })
    )
    this.filteredExcludedTags = this.excludedTagsControl.valueChanges.pipe(
      startWith(null),
      map((tagSearch: string | null) => {
        if (tagSearch === null || tagSearch === '') return this.tags.slice(0, this.autocompleteListSize)
        return this.tags.filter(tag => tag.startsWith(tagSearch)).slice(0, this.autocompleteListSize)
      })
    )
    this.mybs.Authors.subscribe(authors => {
      this.authors = authors
      let authorsArray = []
      for (let authorId in authors) {
        authors[authorId].authorId = authorId
        authorsArray.push(authors[authorId])
      }
      this.authorsArray = authorsArray
      this.includedAuthorsControl.setValue(null)
      this.excludedAuthorsControl.setValue(null)
    })
    this.mybs.Tags.subscribe(tags => {
      this.tags = tags
      this.includedTagsControl.setValue(null)
      this.excludedTagsControl.setValue(null)
    })
    this.mybs.Settings.subscribe(newSettings => {
      this.settings = newSettings
      if (this.firstLoad) {
        this.firstLoad = false
        this.setForm(newSettings)
      }
    })
    this.settingsForm.valueChanges
      .pipe(debounceTime(100))
      .subscribe(newSettings => {
        this.settings!.filterBefore = newSettings.filters!.before?.getTime() ?? null
        this.settings!.filterAfter = newSettings.filters!.after?.getTime() ?? null
        this.settings!.filterTitle = newSettings.filters!.title ?? null
        this.settings!.filterDescription = newSettings.filters!.description ?? null
        this.mybs.Settings.next(this.settings!)
        this.mybs.UpdateList.next(true)
      })
  }
  setForm(settings: Settings) {
    if(this.settings) this.settings!.filterAuthorsInclude = settings.filterAuthorsInclude
    if(this.settings) this.settings!.filterAuthorsExclude = settings.filterAuthorsExclude
    if(this.settings) this.settings!.filterTagsInclude = settings.filterTagsInclude
    if(this.settings) this.settings!.filterTagsExclude = settings.filterTagsExclude
    this.settingsForm.setValue({
      filters: {
        title: settings.filterTitle,
        description: settings.filterDescription,
        before: settings.filterBefore ? new Date(settings.filterBefore) : null,
        after: settings.filterAfter ? new Date(settings.filterAfter) : null,
      }
    })
  }
  restoreDefaults() {
    this.setForm(this.mybs.WebSettings!)
  }
  addIncludedAuthor(author: Author) {
    if (this.settings!.filterAuthorsInclude.some(included => included === author.authorId)) return
    this.includedAuthorsControl.setValue(null)
    this.settings!.filterAuthorsInclude.push(author.authorId)
    this.mybs.Settings.next(this.settings!)
    this.mybs.UpdateList.next(true)
  }
  removeIncludedAuthor(author: Author) {
    if (!this.settings!.filterAuthorsInclude.some(included => included === author.authorId)) return
    this.settings!.filterAuthorsInclude.splice(this.settings!.filterAuthorsInclude.indexOf(author.authorId), 1)
    this.mybs.Settings.next(this.settings!)
    this.mybs.UpdateList.next(true)
  }
  addExcludedAuthor(author: Author) {
    if (this.settings?.filterAuthorsExclude.some(excluded => excluded === author.authorId)) return
    this.excludedAuthorsControl.setValue(null)
    this.settings?.filterAuthorsExclude.push(author.authorId)
    this.mybs.Settings.next(this.settings!)
    this.mybs.UpdateList.next(true)
  }
  removeExcludedAuthor(author: Author) {
    if (!this.settings?.filterAuthorsExclude.some(excluded => excluded === author.authorId)) return
    this.settings?.filterAuthorsExclude.splice(this.settings?.filterAuthorsExclude.indexOf(author.authorId), 1)
    this.mybs.Settings.next(this.settings!)
    this.mybs.UpdateList.next(true)
  }
  addIncludedTag(tag: string) {
    if (this.settings?.filterTagsInclude.some(included => included === tag)) return
    this.includedTagsControl.setValue(null)
    this.settings?.filterTagsInclude.push(tag)
    this.mybs.Settings.next(this.settings!)
    this.mybs.UpdateList.next(true)
  }
  removeIncludedTag(tag: string) {
    if (!this.settings?.filterTagsInclude.includes(tag)) return
    this.settings?.filterTagsInclude.splice(this.settings?.filterTagsInclude.indexOf(tag), 1)
    this.mybs.Settings.next(this.settings!)
    this.mybs.UpdateList.next(true)
  }
  addExcludedTag(tag: string) {
    if (this.settings?.filterTagsExclude.includes(tag)) return
    this.excludedTagsControl.setValue(null)
    this.settings?.filterTagsExclude.push(tag)
    this.mybs.Settings.next(this.settings!)
    this.mybs.UpdateList.next(true)
  }
  removeExcludedTag(tag: string) {
    if (!this.settings?.filterTagsExclude.some(included => included === tag)) return
    this.settings?.filterTagsExclude.splice(this.settings?.filterTagsExclude.indexOf(tag), 1)
    this.mybs.Settings.next(this.settings!)
    this.mybs.UpdateList.next(true)
  }
  clearFilters() {
    if (
      this.settingsForm.value.filters?.title !== null ||
      this.settingsForm.value.filters?.description !== null ||
      this.settingsForm.value.filters?.before !== null ||
      this.settingsForm.value.filters?.after !== null ||
      this.settings!.filterAuthorsInclude.length > 0 ||
      this.settings!.filterAuthorsExclude.length > 0 ||
      this.settings!.filterTagsInclude.length > 0 ||
      this.settings!.filterTagsExclude.length > 0
    ) {
      this.settings!.filterAuthorsInclude = []
      this.settings!.filterAuthorsExclude = []
      this.settings!.filterTagsInclude = []
      this.settings!.filterTagsExclude = []
      this.settingsForm.get('filters')?.setValue({
        title: null,
        description: null,
        before: null,
        after: null
      })
    }
  }
}
