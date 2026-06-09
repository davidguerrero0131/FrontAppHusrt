import { Directive, HostListener, ElementRef, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: 'input:not([noUppercase]):not(.no-uppercase):not([type="password"]):not([type="email"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="time"]):not([type="date"]):not([type="number"]):not([type="datetime-local"]), textarea:not([noUppercase]):not(.no-uppercase)'
})
export class UppercaseDirective {
  constructor(private el: ElementRef, @Optional() private control: NgControl) { }

  @HostListener('input', ['$event']) onInput(event: any) {
    const start = this.el.nativeElement.selectionStart;
    const end = this.el.nativeElement.selectionEnd;
    
    const value = this.el.nativeElement.value.toUpperCase();
    
    if (this.control && this.control.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
    
    this.el.nativeElement.value = value;
    
    // Restore cursor position
    this.el.nativeElement.setSelectionRange(start, end);
  }

  @HostListener('blur') onBlur() {
    this.applyUppercase();
  }

  @HostListener('change') onChange() {
    this.applyUppercase();
  }

  private applyUppercase() {
    const value = this.el.nativeElement.value.toUpperCase();
    if (this.control && this.control.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
    this.el.nativeElement.value = value;
  }
}
