import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const slideInAnimation = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(-100%)', opacity: 0 }))
  ])
]);

export const scaleInAnimation = trigger('scaleIn', [
  transition(':enter', [
    style({ transform: 'scale(0.9)', opacity: 0 }),
    animate('250ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1)', opacity: 1 }))
  ])
]);

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(50, [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ], { optional: true })
  ])
]);

export const cardHoverAnimation = trigger('cardHover', [
  state('default', style({
    transform: 'scale(1)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  })),
  state('hovered', style({
    transform: 'scale(1.02)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  })),
  transition('default <=> hovered', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)'))
]);

export const modalAnimation = trigger('modalAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 })),
    query('.modal-content', [
      style({ transform: 'scale(0.9) translateY(-20px)', opacity: 0 }),
      animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        style({ transform: 'scale(1) translateY(0)', opacity: 1 })
      )
    ], { optional: true })
  ]),
  transition(':leave', [
    query('.modal-content', [
      animate('200ms ease-in', style({ transform: 'scale(0.9) translateY(-20px)', opacity: 0 }))
    ], { optional: true }),
    animate('150ms ease-in', style({ opacity: 0 }))
  ])
]);

export const pulseAnimation = trigger('pulse', [
  state('inactive', style({ transform: 'scale(1)' })),
  state('active', style({ transform: 'scale(1)' })),
  transition('inactive => active', [
    animate('600ms', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.05)', offset: 0.5 }),
      style({ transform: 'scale(1)', offset: 1 })
    ]))
  ])
]);

export const bounceInAnimation = trigger('bounceIn', [
  transition(':enter', [
    animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', keyframes([
      style({ transform: 'scale(0)', opacity: 0, offset: 0 }),
      style({ transform: 'scale(1.1)', opacity: 0.7, offset: 0.6 }),
      style({ transform: 'scale(0.95)', opacity: 0.9, offset: 0.8 }),
      style({ transform: 'scale(1)', opacity: 1, offset: 1 })
    ]))
  ])
]);

export const rotateAnimation = trigger('rotate', [
  state('default', style({ transform: 'rotate(0deg)' })),
  state('rotated', style({ transform: 'rotate(180deg)' })),
  transition('default <=> rotated', animate('300ms ease-in-out'))
]);

export const slideDownAnimation = trigger('slideDown', [
  transition(':enter', [
    style({ height: 0, opacity: 0, overflow: 'hidden' }),
    animate('300ms ease-out', style({ height: '*', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ height: '*', opacity: 1, overflow: 'hidden' }),
    animate('250ms ease-in', style({ height: 0, opacity: 0 }))
  ])
]);

export const shakeAnimation = trigger('shake', [
  transition('* => *', [
    animate('500ms', keyframes([
      style({ transform: 'translateX(0)', offset: 0 }),
      style({ transform: 'translateX(-10px)', offset: 0.1 }),
      style({ transform: 'translateX(10px)', offset: 0.2 }),
      style({ transform: 'translateX(-10px)', offset: 0.3 }),
      style({ transform: 'translateX(10px)', offset: 0.4 }),
      style({ transform: 'translateX(-10px)', offset: 0.5 }),
      style({ transform: 'translateX(10px)', offset: 0.6 }),
      style({ transform: 'translateX(-10px)', offset: 0.7 }),
      style({ transform: 'translateX(10px)', offset: 0.8 }),
      style({ transform: 'translateX(0)', offset: 1 })
    ]))
  ])
]);
