import {
    Component,
    Input,
    Output,
    ElementRef,
    ViewChild,
    Renderer,
    forwardRef,
    OnInit,
    EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Album } from '../Albums/album';


const INLINE_EDIT_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InlineEditComponent),
    multi: true
};

@Component({
    selector: 'inline-edit',
    template: require('./inline-edit.component.html'),
    providers: [INLINE_EDIT_CONTROL_VALUE_ACCESSOR],
    styles: [require('./inline-edit.component.css')]
})

export class InlineEditComponent implements ControlValueAccessor, OnInit {

    @ViewChild('inlineEditControl') inlineEditControl: ElementRef; // input DOM element
    @Input() album: Album;
    @Input() label: string = '';  // Label value for input element
    @Input() type: string = 'text'; // The type of input element
    @Input() required: boolean = false; // Is input requried?
    @Input() disabled: boolean = false; // Is input disabled?
    private _value: string = ''; // Private variable for input value
    private preValue: string = ''; // The value before clicking to edit
    private editing: boolean = false; // Is Component in edit mode?
    public onChange: any = Function.prototype; // Trascend the onChange event
    public onTouched: any = Function.prototype; // Trascend the onTouch event
    albumForm: FormGroup;
    @Output() notify: EventEmitter<Album> = new EventEmitter<Album>();

    constructor(element: ElementRef, private _renderer: Renderer, private fb: FormBuilder) {
    }

    ngOnInit() {

        this.albumForm = this.fb.group({
            id: [this.album.Id],
            title: [this.album.Title, [Validators.required, Validators.minLength(2)]],
            description: [this.album.Description, [Validators.required, Validators.minLength(10)]]
        });

    };

    onSubmit({ value, valid }: { value: Album, valid: boolean }) {
        console.log(value, valid);
        this.notify.emit(value);
        this.editing = false;              
    }

    cancel() {
        this.albumForm.get('title').setValue(this.album.Title);
        this.albumForm.get('description').setValue(this.album.Description);
        this.editing = false;
    }

    // Start the editting process for the input element
    edit() {
        if (this.disabled) {
            return;
        }

        this.editing = true;
    }

    // Start the editting process for the input element
    delete(album: Album) {
        if (this.disabled) {
            return;
        }

        console.log('this album will now be deleted: ' + JSON.stringify(album));

        // add delete logic
    }


    // Control Value Accessors for ngModel
    get value(): any {
        return this._value;
    }

    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    

    // Required for ControlValueAccessor interface
    writeValue(value: any) {
        this._value = value;
    }

    // Required forControlValueAccessor interface
    public registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    // Required forControlValueAccessor interface
    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    // Do stuff when the input element loses focus
    onBlur($event: Event) {
        this.editing = false;
    }

    convertDateTime(date: Date) {
        var _formattedDate = new Date(date.toString());
        return _formattedDate.toDateString();
    }

    
}