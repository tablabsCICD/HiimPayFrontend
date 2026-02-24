import { Component } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import dayjs from 'dayjs';
import { SearchuserService } from '../../service/searchuser.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.css'
})
export class ReminderComponent {
  total:any=0;
  upcoming:any=0;
  selected: Date | null | undefined;
  highlightDate: MatCalendarCellCssClasses = [];
  eventData:any = []
  filteredEventData:any = [];
  selectedCard:any = "totalEvent"
  allDates:any;
  reminders:any;
  isLoadingReminder:boolean=false;

  constructor(private service:EmployeeService,private searchservice:SearchuserService) { }

  ngOnInit(): void {
    const currentDate = new Date();
    this.getAllMeetingDatesByMonth(currentDate.getMonth() + 1, currentDate.getFullYear());
    this.searchservice.sendResults().subscribe({
      next: (res: any) => {
        if (res.length == 0) {
          this.getUpcomingEvents();
        } else {
          if (res.success) {
            this.filteredEventData = res.data
          } else {
            this.filteredEventData = [];
          }
        }
      },
      error: (err: any) => {},
      complete: () => {},
    });
  }
  

  getMonthName(month: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
  }

  getAllMeetingDatesByMonth(month: number, year: number): void {
    this.service.getMeetingsDateByMonth(month, year, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({
      next: (res: any) => {
        this.allDates = res.data;
        this.allDates.sort((a: string, b: string) => {
          return new Date(a).getTime() - new Date(b).getTime();
        });
  
        if (this.allDates.length > 0) {
          const upcomingDateIndex = this.findUpcomingDateIndex();
          if (upcomingDateIndex !== -1) {
            this.getEventOnDateByUserID(this.allDates[upcomingDateIndex]);
          }
          // this.getEventOnDateByUserID(this.allDates[0]);
        }
        console.log(this.allDates)
      },
      error: (err: any) => {
        this.allDates = []
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

  getUpcomingEvents(){ 
    const formattedDate = this.formatDate(new Date());
    const { id: userId } = JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!)
    this.service.getUpcomingEventsById(formattedDate,userId, 0, 100).subscribe((data) => {
      this.eventData = data.data;
      this.total = this.eventData.totalEvent.count;
      this.upcoming = this.eventData.upcomingEvent.count
      this.filteredEventData = this.eventData.totalEvent.values
    });
  }

  onDateSelected(selectedDate: Date | null): void {
    if (selectedDate) {
      this.selected = selectedDate;
      const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
      this.getEventOnDateByUserID(formattedDate);
    }
  }


  getEventOnDateByUserID(date:any){
    this.service.getEventOnDateByUserID(date, JSON.parse(sessionStorage.getItem("currentLoggedInUserData")!).id).subscribe({next:(res)=>{
      this.reminders=res.data;
    },error:(err)=>{console.log(err)},complete:()=>{}})
  }

  getRemindersByStatus(status: any){
    this.selectedCard = status
    this.filteredEventData = this.eventData[status].values
  }

  onMonthSelected(event: Date): void {
    this.getAllMeetingDatesByMonth(event.getMonth() + 1, event.getFullYear());
  }

  relativePercentage(statusCount: any) {
    return (statusCount / this.total) * 100;
  }

  openMeeting(link: string) {
    window.open(link, '_blank');
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let isHighlighted = false;
    isHighlighted = this.allDates.some(
        (data: any) =>
          dayjs(data).format('DD/MM/YYYY') ==
          dayjs(date).format('DD/MM/YYYY')
      );
    return isHighlighted ? 'highlightDate' : '';
  };


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

}