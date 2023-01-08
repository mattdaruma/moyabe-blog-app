import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTabsModule } from '@angular/material/tabs'
import { MatChipsModule } from '@angular/material/chips'; 
import { MatDatepickerModule } from '@angular/material/datepicker'; 

import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MarkdownModule } from 'ngx-markdown';
import { PostComponent } from './post/post.component';
import { KeysPipe } from './keys.pipe';
import { HttpClientModule } from '@angular/common/http';
import { FeedComponent } from './feed/feed.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedSettingsComponent } from './feed/feed-settings/feed-settings.component';
import { FeedTableComponent } from './feed/feed-table/feed-table.component';
import { FeedCardsComponent } from './feed/feed-cards/feed-cards.component';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    KeysPipe,
    FeedComponent,
    FeedTableComponent,
    FeedCardsComponent,
    FeedSettingsComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatChipsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonToggleModule,
    HttpClientModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
