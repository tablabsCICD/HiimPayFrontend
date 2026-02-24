import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  currentMessage : any;

  constructor(private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messages.subscribe(
      (message: any) => {
        console.log(message);
        this.currentMessage = message;
      });
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.pipe(take(1)).subscribe(
      (token) => {
        console.log(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log('Message received. ', payload);
        this.currentMessage.next(payload);
        if (payload.data) {
          this.showNotification(payload.data['title'], `${payload.data['subTitle']}: ${payload.data['body']}`, payload.data['image']);
        }
      });
  }

  private showNotification(title: any, body: string, icon: string) {
    const notification = new Notification(title, {
      body: body,
      icon: icon
    });
  }
}
