import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: FeedComponent},
  {path: 'post/:postId', component: PostComponent},
  {path: '**', redirectTo: '/'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
