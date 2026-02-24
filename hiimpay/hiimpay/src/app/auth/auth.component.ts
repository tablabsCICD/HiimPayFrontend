import { Component } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  // constructor(private messagingService: MessageService) {}

  // ngOnInit() {
  //   this.messagingService.requestPermission();
  //   this.messagingService.receiveMessage().subscribe(
  //     (message:any) => {
  //       console.log(message);
  //     });
  // }
}

