import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { BackgroundProcessService } from './superadmin/project/Components/dashboard/background-process.service';
import { NavigationEnd, Router } from '@angular/router';
declare let gtag: Function;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit  {
  title = 'exwise';
  message:any;
  showBackgroundMessage = false;
  showBackgroundMessageForReminder = false;


  constructor(private messagingService: MessageService,private backgroundProcessService: BackgroundProcessService, private router: Router) {}

  notificationTitle: any;
  notificationBody: any;
  notificationSubTitle: any;



  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-XXXXXXXXXX', { 'page_path': event.urlAfterRedirects });
      }
    });

    this.backgroundProcessService.backgroundProcess$.subscribe(
      (show) => (this.showBackgroundMessage = show)
    );

    this.backgroundProcessService.backgroundProcessReminder$.subscribe(
      (show) => (this.showBackgroundMessageForReminder = show)
    );
    // this.messagingService.requestPermission();
    // this.messagingService.receiveMessage();
    // this.messagingService.currentMessage.subscribe((message:any) => {
    //   if (message) {
    //     this.message = message;
    //     console.log("Foreground message received:", message);
       
    //   }
    // });
  }

}



// http://localhost:4200/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnYXVyYXZkYWdkdUB5b3BtYWlsLmNvbSIsImV4cCI6MTcwOTg2NDQyNywiaWF0IjoxNzA5ODI4NDI3fQ.GVrz-pFzblbOjqqfmJK5GYArxItjA78W_-4Y3mBU9A4