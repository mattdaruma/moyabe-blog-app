import { trigger, state, style, transition, animate, animateChild, query } from "@angular/animations";

export const fade = trigger('fade', [
    state('in', style({ opacity: 1 })),
    state('out', style({ opacity: 0})),
    transition('out => in', [ 
      animate(150)
    ]),
    transition('in => out', [
      animate(150)
    ])
])