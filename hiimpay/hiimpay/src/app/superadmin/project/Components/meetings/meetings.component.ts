import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { ScheduleComponent } from './schedule/schedule.component';
import { DateAdapter } from '@angular/material/core';
import { CreateGroupComponent } from './create-group/create-group.component';
import { Observable, Subscription } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { DatePipe } from '@angular/common';
import { DeleteComponent } from '../../../pages/delete/delete.component';
import { ApiService } from '../../../services/api.service';
import { CreateUserComponent } from '../project-admin/create-user/create-user.component';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css',
  providers: [DatePipe]
})
export class MeetingsComponent implements OnInit {
  filterToggle: boolean = false;
  interviewCount: any;
  schedulecount: number = 0;
  reschedulecount: number = 0;
  cancelcount: number = 0;
  columnSelection: any = '';
  filterTable: any = '';
  dept: any[] = [];
  deptToFilter: any[] = [];
  highlightDate: MatCalendarCellCssClasses = [];
  isDataLoaded: Observable<any> = new Observable<any>();
  dataId: any;
  deptDetails: any;
  emp: any;
  index: any;
  vissible: boolean = true;
  isVissible: boolean = false;
  submitted: boolean = false;
  departmentForm!: FormGroup;
  p: number = 1;
  a: number = 1;
  itemPerPage: number = 10;
  sortDir: any = 'asc';
  totalItems: number = 0;
  selected: Date | null | undefined;
  highlightedDates: Date[] = [new Date('2024-04-15'), new Date('2024-04-20')];
  cardsCircle2: any;
  meetingDay: any;
  meetingMonth: any;
  meetingDate2: any;
  allUser: any;
  selectedCard: any = "schedule"
  clientId: any;
  selectedOption: any = '';
  reminders: any;
  form!: FormGroup;
  isLoading: boolean = false;
  isLoadingReminder: boolean = false;
  allDates: any;
  // allDates2: any = ["2024-10-09","2024-10-21","2024-10-11","2024-11-10","2024-11-17"];
  typeOfUser: any;
  displayClientData: any;

  selectedTab: string = 'My activity';
  tabsdata: any[] = [
    { name: 'My activity', clicked: true },
    { name: 'All activity', clicked: false }
  ];

  @ViewChild('calender') calendar!: MatCalendar<Date>;
  private monthChangeSubscription!: Subscription;

  constructor(private service: ProjectService,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private dialog: MatDialog,
    private toaster: ToastrService,
    private searchservice: SearchService,
    private datePipe: DatePipe,
    private api: ApiService) {

  }


  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  // ngDoCheck(): void {
  //   //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
  //   //Add 'implements DoCheck' to the class.
  //   console.log(this.calendar);
  //   if(this.calendar){
  //     console.log(this.calendar.stateChanges);
  //     this.calendar.stateChanges.subscribe(() => {
  //       const activeDate = this.calendar.activeDate;
  //       console.log(activeDate);
  //       this.getAllMeetingDatesByMonthForAdmin(activeDate.getMonth() + 1, activeDate.getFullYear());
  //       this.dateClass(activeDate);
  //       // console.log('Month changed to:', activeDate.getMonth() + 1, activeDate.getFullYear());
  //       // activeDate.getMonth() gives the month (0-indexed, so +1 to get the correct month)
  //     });
  //     // console.log(this.calendar.stateChanges);
  //   }


  // }

  ngOnInit(): void {
    this.displayClientData = JSON.parse(sessionStorage.getItem('ClientData')!);
    this.typeOfUser = JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).typeOfUser;
    const id = sessionStorage.getItem("ClientId");
    // this.service.getUserByClientID(sessionStorage.getItem("ClientId")).subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     this.allUser = res.data;
    //   }, error: (err: any) => {
    //     console.log(err);
    //   }, complete: () => { }

    // })

    this.searchservice.sendResults().subscribe({
      next: (res: any) => {
        if (res.length == 0) {
          // if(this.typeOfUser===0){
          this.getAllMeetingsForAdminByStatus('schedule');
          // }
          // else{
          // this.getOneToOneInterviewByStatus('schedule');
          // }
        } else {
          if (res.success) {
            this.cardsCircle2 = res.data;
          } else {
            this.cardsCircle2 = [];
          }
        }
      },
      error: (err: any) => { },
      complete: () => { },
    });

    // if(this.typeOfUser===0){
    this.getAllMeetingsForAdminByStatus('schedule');
    const currentDate = new Date();
    this.getAllMeetingDatesByMonthForAdmin(currentDate.getMonth() + 1, currentDate.getFullYear());
    // }
    // else{
    // this.getOneToOneInterviewByStatus('schedule');
    // const currentDate = new Date();
    // this.getAllMeetingDatesByMonth(currentDate.getMonth() + 1, currentDate.getFullYear());
    // }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  getAllMeetingsForAdminByStatus(status: string) {
    this.isLoading = true;
    this.selectedCard = status;
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    const formattedDate = this.formatDate(new Date());
    this.api.getAdminInterviewByStatus(clientId, formattedDate, status, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
      next: (res: any) => {
        this.cardsCircle2 = res.data.sortedList;
        this.schedulecount = res.data.schedule;
        this.reschedulecount = res.data.reSchedule;
        this.cancelcount = res.data.cancel
        this.isLoading = false;
      }, error: (err: any) => { console.log(err) }, complete: () => { }
    });
  }

  getAllMeetingDatesByMonthForAdmin(month: number, year: number) {
    this.isLoading = true;
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    const userID = JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id
    this.api.getMeetingsByMonthForAdmin(clientId, month, userID, year).subscribe({
      next: (res: any) => {
        this.allDates = res.data;
        this.allDates.sort((a: string, b: string) => {
          return new Date(a).getTime() - new Date(b).getTime();
        });
        if (this.allDates?.length > 0) {
          const upcomingDateIndex = this.findUpcomingDateIndex();
          if (upcomingDateIndex !== -1) {
            this.getEventOnDateForAdmin(this.allDates[upcomingDateIndex]);
          }
          // this.getEventOnDateForAdmin(this.allDates[0]);
        }
        this.isLoading = false;
        this.isDataLoaded = new Observable((subscriber) => {
          subscriber.next(this.allDates);
        });
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => { },
    });
  }

  findUpcomingDateIndex(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < this.allDates.length; i++) {
      const date = new Date(this.allDates[i]);
      date.setHours(0, 0, 0, 0);

      if (date >= today) {
        return i;
      }
    }
    return -1;
  }


  getEventOnDateForAdmin(date: any) {

    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    this.api.getEventOnDateForAdmin(clientId, date, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
      next: (res) => {
        this.reminders = res.data;
      }, error: (err) => { console.log(err) }, complete: () => { }
    })
  }

  modelChangeFn(event: any) {

  }
  openMeeting(link: string) {
    window.open(link, '_blank');
  }
  getAllMeeting() {
    this.service.getAllOnetoOneInterview().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allUser = res.data;
      }, error: (err: any) => {
        console.log(err);
      }, complete: () => { }

    })
  }

  getOneToOneInterviewByStatus(status: any) {
    this.isLoading = true;
    this.selectedCard = status;
    const formattedDate = this.formatDate(new Date());
    this.service.getOneToOneInterviewByStatus(formattedDate, status, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
      next: (res: any) => {
        this.cardsCircle2 = res.data.sortedList;
        this.schedulecount = res.data.schedule;
        this.reschedulecount = res.data.reSchedule;
        this.cancelcount = res.data.cancel
        this.isLoading = false;
      }, error: (err: any) => { console.log(err) }, complete: () => { }
    });
  }


  onDeleteInterview(meet: any) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        message: `Do you really want to cancel the meeting ${meet?.title} ?`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'ok') {
        if(meet?.tableType=='Interview'){
        this.service.softDeleteInterviewOneToOne(meet.id).subscribe({
          next: (res: any) => {
            console.log(res);
            this.toaster.success('Meeting cancelled successfully', 'Success');
            this.getAllMeetingsForAdminByStatus('schedule');
            window.location.reload();

          }, error: (err: any) => {
            console.log(err);
          }, complete: () => { }
        })
      }
      else{
        this.service.softDeleteFocuseGroupMeeting(meet.id).subscribe({
          next: (res: any) => {
            console.log(res);
            this.toaster.success('Meeting cancelled successfully', 'Success');
            this.getAllMeetingsForAdminByStatus('schedule');
            window.location.reload();

          }, error: (err: any) => {
            console.log(err);
          }, complete: () => { }
        })
      }
      }
    })

  }
  hideOffCanvas() { }
  cardsCircle: any[] = [
    { name: 'Schedule', count: '2' },
    { name: 'Reschedule', count: '2' },
    { name: 'Cancel', count: '2' }
  ]


  formatTime(time: string | null): string {
    if (!time) {
      return '-'; // Return dash if time is null or undefined
    }

    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    return this.datePipe.transform(date, 'hh:mm a') || '-'; // Return dash if transform fails
  }


  getAllMeetingDatesByMonth(month: number, year: number): void {
    this.service.getMeetingsDateByMonth(month, year, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
      next: (res: any) => {
        this.allDates = res.data;
        console.log(res.data);
        this.isDataLoaded = new Observable((subscriber) => {
          subscriber.next(this.allDates);
        });
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => { },
    });
    this.calendar.updateTodaysDate();
  }

  onDateSelected(selectedDate: Date | null): void {
    if (selectedDate) {
      this.selected = selectedDate;
      const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
      // if(this.typeOfUser===0){
      this.getEventOnDateForAdmin(formattedDate);
      // }
      // else{
      //   this.getEventOnDateByUserID(formattedDate);
      // }
    }
  }

  onMonthSelected(event: Date): void {
    // if(this.typeOfUser===0){
    this.getAllMeetingDatesByMonthForAdmin(event.getMonth() + 1, event.getFullYear());
    // }
    // this.getAllMeetingDatesByMonth(event.getMonth() + 1, event.getFullYear());
  }

  onYearSelected(event: Date): void {
    // this.getAllMeetingDatesByMonth(event.getMonth() + 1, event.getFullYear());
  }


  getEventOnDateByUserID(date: any) {
    this.service.getEventOnDateByUserID(date, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
      next: (res) => {
        this.reminders = res.data;
      }, error: (err) => { console.log(err) }, complete: () => { }
    })
  }

  openPopup(): void {
    const dailogRef = this.dialog.open(ScheduleComponent, {
      width: '800px',
      height: '600px',
      disableClose: true,
    });
    dailogRef.afterClosed().subscribe(() => {
      this.getAllMeetingsForAdminByStatus('schedule');
      const currentDate = new Date();
      this.getAllMeetingDatesByMonthForAdmin(currentDate.getMonth() + 1, currentDate.getFullYear());
    });
  }
  createGroups() {
    const dialogRef = this.dialog.open(CreateGroupComponent, {
      width: '1100px',
      height: '700px',
      disableClose: true,
      data: { name: 'createGroup' }
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.getAllFocusGroup();
    })

  }

  editMetting(id: any, tableType: any) {
    console.log(id)
    this.dialog.open(ScheduleComponent, {
      width: '800px',
      height: '450px',
      disableClose: true,
      data: { id: id, tableType }
    });
  }

  openMeetingInBrowser(link: string) {
    window.open(link, '_blank');
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    console.log(date)
    let isHighlighted = false;
    isHighlighted = this.allDates.some(
      (data: any) =>
        dayjs(data).format('DD/MM/YYYY') ==
        dayjs(date).format('DD/MM/YYYY')
    );
    return isHighlighted ? 'highlightDate' : '';
  };


  viewChanged(event: any) {
    console.log(event)
  }

  getAllActivityAdminInterviewByStatus(status: string) {
    this.isLoading = true;
    this.selectedCard = status;
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    const formattedDate = this.formatDate(new Date());
    this.api.getAllActivityAdminInterviewByStatus(clientId, formattedDate, status).subscribe({
      next: (res: any) => {
        this.cardsCircle2 = res.data.sortedList;
        this.schedulecount = res.data.schedule;
        this.reschedulecount = res.data.reSchedule;
        this.cancelcount = res.data.cancel
        this.isLoading = false;
      }, error: (err: any) => { console.log(err) }, complete: () => { }
    });
  }

  getAllActivityMeetingDatesByMonthForAdmin(month: number, year: number) {
    this.isLoading = true;
    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    const userID = JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id
    this.api.getAllActivityMeetingsByMonthForAdmin(clientId, month, year).subscribe({
      next: (res: any) => {
        this.allDates = res.data;
        this.allDates.sort((a: string, b: string) => {
          return new Date(a).getTime() - new Date(b).getTime();
        });
        if (this.allDates?.length > 0) {
          this.getAllActivityEventOnDateForAdmin(this.allDates[0]);
        }
        // this.getEventOnDateForAdmin(this.allDates[0])
        this.isLoading = false;
        this.isDataLoaded = new Observable((subscriber) => {
          subscriber.next(this.allDates);
        });
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => { },
    });
  }

  getAllActivityEventOnDateForAdmin(date: any) {

    const clientId = parseInt(sessionStorage.getItem("ClientId")!, 10);
    this.api.getAllActivityEventOnDateForAdmin(clientId, date).subscribe({
      next: (res) => {
        this.reminders = res.data;
      }, error: (err) => { console.log(err) }, complete: () => { }
    })
  }

  onTabClick(selectedTab: any) {
    this.tabsdata.forEach(tab => tab.clicked = false);
    selectedTab.clicked = true;
    this.selectedTab = selectedTab.name;
    this.cardsCircle2 = [];
    this.schedulecount = 0;
    this.reschedulecount = 0;
    this.cancelcount = 0;
    this.reminders = [];
    this.allDates = [];
    this.calendar?.updateTodaysDate();
    if (this.selectedTab === 'My activity') {
      this.getAllMeetingsForAdminByStatus('schedule');
      const currentDate = new Date();
      this.getAllMeetingDatesByMonthForAdmin(currentDate.getMonth() + 1, currentDate.getFullYear());
    }
    else {
      this.getAllActivityAdminInterviewByStatus('schedule');
      const currentDate = new Date();
      this.getAllActivityMeetingDatesByMonthForAdmin(currentDate.getMonth() + 1, currentDate.getFullYear());
    }
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