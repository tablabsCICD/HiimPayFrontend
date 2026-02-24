import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchuserService } from '../../service/searchuser.service';

@Component({
  selector: 'app-faquser',
  templateUrl: './faquser.component.html',
  styleUrl: './faquser.component.css'
})
export class FaquserComponent {

  faqs = [
    {
      id: 1,
      question: 'What is HiimPAY?',
      answer: 'HiimPAY is a digital platform designed to manage brands, coupons, vouchers, employees, and rewards in a secure and centralized manner for organizations.'
    },
    {
      id: 2,
      question: 'Who can use HiimPAY?',
      answer: 'HiimPAY can be used by Super Admins, Clients (Companies), and Employees. Each user type has different access levels and features based on their role.'
    },
    {
      id: 3,
      question: 'How do I onboard employees?',
      answer: 'Employees can be onboarded manually or via bulk Excel upload. Admins can review and approve employee data before activation.'
    },
    {
      id: 4,
      question: 'What are coupons and vouchers?',
      answer: 'Coupons and vouchers are digital rewards provided by brands. These can be fixed value, variable value, or gift card–based and can be assigned to employees.'
    },
    {
      id: 5,
      question: 'How are coupons assigned to employees?',
      answer: 'Admins or Clients can assign coupons or monetary amounts individually, in groups, or to all employees based on configured permissions.'
    },
    {
      id: 6,
      question: 'Can coupons be assigned in bulk?',
      answer: 'Yes, coupons and amounts can be assigned in bulk using Excel upload, making it easier to manage large employee groups.'
    },
    {
      id: 7,
      question: 'What happens when an employee redeems a coupon?',
      answer: 'Once a coupon is redeemed, its status is updated automatically and the usage is reflected in reports and tracking dashboards.'
    },
    {
      id: 8,
      question: 'Is employee data secure?',
      answer: 'Yes. All employee and transaction data is stored securely with appropriate access controls and follows applicable data protection regulations.'
    },
    {
      id: 9,
      question: 'Can admin access be controlled?',
      answer: 'Yes. Super Admins can create multiple admins and manage their access using permission-based controls.'
    },
    {
      id: 10,
      question: 'Can I track coupon usage and reports?',
      answer: 'Yes. HiimPAY provides detailed reports and dashboards to track coupon allocation, redemption status, and overall usage.'
    },
    {
      id: 11,
      question: 'What should I do if I face an issue?',
      answer: 'If you face any issue, please contact your system administrator or use the support option available in the application.'
    }
  ];

  filteredFaqs = this.faqs;
  subscription!: Subscription;

  constructor(private searchService: SearchuserService) {}

  ngOnInit(): void {
    this.subscription = this.searchService
      .getSearchKeyword()
      .subscribe((keyword: any) => {
        this.filterFaqs(keyword);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterFaqs(query: string): void {
    this.filteredFaqs = this.faqs.filter((faq: any) =>
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase())
    );
  }
}
