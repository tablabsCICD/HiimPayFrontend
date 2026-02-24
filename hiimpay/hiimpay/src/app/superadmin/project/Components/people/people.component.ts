import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrl: './people.component.css'
})
export class PeopleComponent implements OnInit {
constructor(private dialogRef: MatDialogRef<PeopleComponent>,@Inject(DIALOG_DATA) public data: {name: string,id:number},){}
hide:boolean=true;
display:boolean=false;
toppings = new FormControl('');
toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
ngOnInit(): void {
    
}
onClose(): void {
  this.dialogRef.close();
}

displayFunction(){
  this.hide=false;
  this.display=true;
}

next(){
  this.dialogRef.close();
}
}
