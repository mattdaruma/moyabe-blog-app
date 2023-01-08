import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime, first } from 'rxjs';
import { MoyabeBlogService, Settings } from 'src/app/moyabe-blog.service';

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
      after: new FormControl<Date | null>(null)
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
  constructor(public mybs: MoyabeBlogService) {
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
  setForm(settigns: Settings){
    this.settingsForm.get('filters.title')?.setValue(settigns.filterTitle)
    this.settingsForm.get('filters.description')?.setValue(settigns.filterDescription)
    this.settingsForm.get('display.feed')?.setValue(settigns.displayFeed)
    this.settingsForm.get('display.fields')?.setValue(settigns.displayFields)
    this.settingsForm.get('sort.date')?.setValue(settigns.sortDate)
    this.settingsForm.get('sort.title')?.setValue(settigns.sortTitle)
    this.settingsForm.get('sort.author')?.setValue(settigns.sortAuthor)
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
