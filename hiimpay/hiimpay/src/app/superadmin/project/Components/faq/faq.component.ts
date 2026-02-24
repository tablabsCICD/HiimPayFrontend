import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit, OnDestroy {

  faqs = [
    {
      id: 1,
      question: 'What is HiimPAY?',
      answer: 'HiimPAY is a digital platform that helps organizations manage brands, coupons, vouchers, employees, and rewards in a secure and centralized way.'
    },
    {
      id: 2,
      question: 'Who can use HiimPAY?',
      answer: 'HiimPAY can be used by Super Admins, Company Admins, and Employees. Each role has specific permissions and access.'
    },
    {
      id: 3,
      question: 'How do I create or manage users?',
      answer: 'Admins can create users individually or upload users in bulk using an Excel template. User access can be managed based on roles and permissions.'
    },
    {
      id: 4,
      question: 'What are coupons and vouchers?',
      answer: 'Coupons and vouchers are digital rewards provided by brands. These can be fixed-value, variable-value, or gift-card based.'
    },
    {
      id: 5,
      question: 'How are coupons assigned?',
      answer: 'Coupons or amounts can be assigned individually, in bulk, or to all employees depending on admin permissions.'
    },
    {
      id: 6,
      question: 'Can I upload data in bulk?',
      answer: 'Yes, HiimPAY supports bulk uploads for users and coupon allocations using Excel templates.'
    },
    {
      id: 7,
      question: 'What happens when a coupon is redeemed?',
      answer: 'Once redeemed, the coupon status is updated automatically and reflected in reports and dashboards.'
    },
    {
      id: 8,
      question: 'Is my data secure?',
      answer: 'Yes. All data is securely stored with access controls and follows applicable data protection and security standards.'
    },
    {
      id: 9,
      question: 'Can admin access be restricted?',
      answer: 'Yes. Super Admins can control admin access using permission-based settings.'
    },
    {
      id: 10,
      question: 'Where can I see reports?',
      answer: 'Admins can view detailed reports related to coupon allocation, redemption, and usage from the Reports section.'
    },
    {
      id: 11,
      question: 'Who should I contact for support?',
      answer: 'Please contact your system administrator or use the support option available within the application.'
    }
  ];

  filteredFaqs = this.faqs;
  subscription!: Subscription;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.subscription = this.searchService
      .getSearchKeyword()
      .subscribe((keyword: string) => {
        this.filterFaqs(keyword);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  filterFaqs(query: string): void {
    const q = query?.toLowerCase() || '';
    this.filteredFaqs = this.faqs.filter(faq =>
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    );
  }
}
