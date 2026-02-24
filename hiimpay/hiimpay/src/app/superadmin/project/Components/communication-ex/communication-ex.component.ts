import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { formatDistanceToNow } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from '../project-admin/create-user/create-user.component';
interface Attachment {
  name: string;
  url: string;
}

interface Message {
  id: number;
  text: string;
  type: 'received' | 'sent';
  attachments: Attachment[];
}

@Component({
  selector: 'app-communication-ex',
  templateUrl: './communication-ex.component.html',
  styleUrl: './communication-ex.component.css',
})
export class CommunicationExComponent implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  isCpoc: boolean = false;
  isLoading: boolean = false;
  isLoadingForDoc: boolean = false;
  messages: any = [];
  newMessage = '';
  hover: boolean = false;
  senderMsg: any;
  document: any;
  documentName:any;
  selectedfile: any;
  intervalId: any;
  displayClientData: any;


  constructor(private service: ProjectService,public dialog: MatDialog,) {}
  ngOnInit(): void {
    this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
    this.isCpoc = sessionStorage.getItem('isCpoc') == 'true';
    this.getChats();

    this.intervalId = setInterval(() => {
      this.getChatsAfterLoad();
    }, 5000);
  }

  scrollToBottom(): void {
    if (this.messageContainer && this.messageContainer.nativeElement) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } else {
      console.error('messageContainer is not available.');
    }
  }
  

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000); 
  }


  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getChats() {
    this.service
      .communicationByClientId(sessionStorage.getItem('ClientId'))
      .subscribe((res: any) => {
        console.log(res);
        this.senderMsg = res.data;
        this.messages = this.senderMsg.map((val: any) => {
          return { text: val.msg, type: val.senderType, id: val.id, doc: val.doc,senderName:val.senderName,
            receiverName:val.receiverName,createdDate:formatDistanceToNow(new Date(val.createdDate), { addSuffix: true })};
        });
      });
  }

  getChatsAfterLoad() {
    this.service
      .communicationByClientId(sessionStorage.getItem('ClientId'))
      .subscribe((res: any) => {
        this.isLoading = false;
        console.log(res);
        this.senderMsg = res.data;
        this.messages = this.senderMsg.map((val: any) => {
          return { text: val.msg, type: val.senderType, id: val.id, doc: val.doc,senderName:val.senderName,
            receiverName:val.receiverName,createdDate:formatDistanceToNow(new Date(val.createdDate), { addSuffix: true })};
        });
      });
  }
  sendMessage() {
 
    if (this.newMessage || this.document){
      this.messages.push({
        text: this.newMessage,
        type: 'sent',
        doc: this.document,
      });

      if (this.isCpoc == true) {
        console.log('cpoc');

        const obj = {
          clientId: sessionStorage.getItem('ClientId'),
          createdDate: new Date(),
          doc: this.document,
          msg: this.newMessage,
          receiverId: 0,
          senderId: JSON.parse(
            sessionStorage.getItem('currentLoggedInUserData')!
          ).id,
          senderType: 'sent',
        };
        this.service.createCommunication(obj).subscribe((res: any) => {
          console.log(res);
          this.selectedfile = '';
          this.documentName='';
          this.getChats();
          this.newMessage = '';
          this.document = '';
        });
      } else {
        console.log('team Ex');
        const obj = {
          clientId: sessionStorage.getItem('ClientId'),
          createdDate: new Date(),
          doc: this.document,
          msg: this.newMessage,
          receiverId: 0,
          senderId: JSON.parse(
            sessionStorage.getItem('currentLoggedInUserData')!
          ).id,
          senderType: 'received',
        };
        this.service.createCommunication(obj).subscribe((res: any) => {
          console.log(res);
          this.getChats();
          this.newMessage = '';
          this.documentName='';
          this.selectedfile=''
          this.document = '';
        });
      }
    }
  }

  onProfile(event: Event): void {
    this.isLoadingForDoc = true;
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0]; // Get the selected file

    this.selectedfile = inputElement?.files?.[0];
    console.log(this.selectedfile);
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      this.service.saveeDoc(formData).subscribe((res: any) => {
        this.document = res;
        this.documentName = {
          name: file.name,
          url: res.url,  // Assuming the response contains the URL of the uploaded file
        };
        this.isLoadingForDoc=false;
        console.log(res);
      });
    }else{
      this.isLoadingForDoc = false;
    }
  }

  onDownload(url:any){
    console.log(url);
    
    window.open(url)
  }

  deleteClient(id: number) {
    console.log('Delete client', id);
    this.service.deleteCommunication(id).subscribe((res: any) => {
      console.log(res);
    });
  }

  editUser(userId: number) {
    console.log(userId);
    
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      height: '600px',
      disableClose: true,
      data: { name: 'edit-user', id: userId ,  isConsultant:true },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  
}
