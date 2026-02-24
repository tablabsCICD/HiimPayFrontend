import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Brand {
  BrandName: string;
  OnlineRedemptionUrl: string;
  BrandImage: string;
  stockAvailable: boolean;
  categories: string[];
  Descriptions: string;
  updated_at: string;
}

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.css']
})
export class BrandDetailsComponent implements OnInit {
  loading = true;
  brand!: Brand;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadBrandDetails(id);
  }

  loadBrandDetails(id: string | null) {
    setTimeout(() => {
      this.brand = {
        BrandName: 'Bata',
        OnlineRedemptionUrl: 'https://www.bata.in/',
        BrandImage: 'https://cdn.gyftr.com/comm_engine/stag/images/brands/1593693691875_u3qtc3vzkc4s2qqr.png',
        stockAvailable: true,
        categories: ['Footwear', 'Lifestyle'],
        Descriptions: `If you're looking for affordable footwear that does not compromise on style, Bata is the brand for you.`,
        updated_at: '2026-02-18T09:41:20.000Z'
      };

      this.loading = false;
    }, 500);
  }

  back() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
