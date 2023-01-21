import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FadeDeactivateGuard } from './fade-deactivate.guard';
import { FeedComponent } from './feed/feed.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FeedComponent,
    canDeactivate: [FadeDeactivateGuard]
  },
  {
    path: 'post/:postId',
    component: PostComponent,
    canDeactivate: [FadeDeactivateGuard]
  },
  {
    path: '**',
    redirectTo: '/'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
