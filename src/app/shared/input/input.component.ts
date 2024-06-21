import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgForm,
} from '@angular/forms';

@Component({
  selector: 'app-inputfield',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements OnInit, ControlValueAccessor {
  @Input() readonly: boolean = false;
  @Input() type: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() classes?: string | string[] = [];
  @Input() optionClasses?: string | string[] = [];
  @Input() imgName: string = '';
  @Input() imgSize: string = '';
  @Input() required: boolean = false;
  @Output() inputChange = new EventEmitter<string>();
  @Input() imgSrc?: string;
  imgActive: string = '';
  value: string = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inputChange.emit(value);
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    return;
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  onFocusOut(): void {
    this.onTouched();
    this.imgActive = this.imgName;
  }

  ngOnInit() {
    this.imgActive = this.imgName;
  }

  // Funktion zum Wechseln des Bildes bei Fokus
  onFokus() {
    this.imgName = '';
  }

  // Funktion zum Zurücksetzen des Bildes, wenn der Fokus verloren geht
  onBlur() {
    this.imgName = 'search';
  }

  onMouseEnter() {
    this.imgName = '';
  }
}

