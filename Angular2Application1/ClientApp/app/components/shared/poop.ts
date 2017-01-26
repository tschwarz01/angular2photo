import { Component } from '@angular/core';
import { InlineComponent } from './inline.component';

@Component({
    selector: 'poop',
    providers: [],
    template: `
    <div>
      <h2>Inline Editing with Angular 2</h2>
      
      <inline-edit [(ngModel)]="editableText" (onSave)="saveEditable($event)"></inline-edit>
      // Working fine
    </div>
    <div>
      <ul style="margin:5px;">//Not working properly
        <li style="margin:5px;" *ngFor="let arr of array ; let i=index;trackBy:customTrackBy">
          <inline-edit [(ngModel)]="array[i]" (onSave)="saveEditable($event)"></inline-edit>
        </li>
      </ul>
    </div>
  `
})
export class Poop {

    editableText = "Click to edit me!";

    // Save name to the server here.  
    saveEditable(value) {
        console.log(value);
    }

    array = ['bmw', 'benz', 'honda'];

    customTrackBy(index: number): any {
        return index;
    }
}