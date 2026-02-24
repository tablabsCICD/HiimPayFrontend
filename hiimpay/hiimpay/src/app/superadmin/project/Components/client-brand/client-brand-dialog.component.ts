import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

type TabType = 'excel' | 'api';
type OnboardingType = 'EXCEL' | 'API';
type ApiEndpointType = 'auth' | 'data';

interface ApiEndpointConfig {
  name: string;
  type: ApiEndpointType;
  method: 'GET' | 'POST';
  url: string;
  apiKey: string;
  requestSecret: string;
}

interface ApiProfile {
  id: string;
  name: string;
  description: string;
  endpoints: ApiEndpointConfig[];
}

@Component({
  selector: 'app-client-brand-dialog',
  templateUrl: './client-brand-dialog.component.html',
  styleUrls: ['./client-brand-dialog.component.scss']
})
export class ClientBrandDialogComponent {
  activeTab: TabType = 'excel';
  title = 'New Brand';

  brand: {
    id?: string;
    onboardingType: OnboardingType;
    BrandProductCode: string;
    BrandName: string;
    Brandtype: string;
    RedemptionType: string;
    OnlineRedemptionUrl: string;
    BrandImage: string;
    denominationList: string;
    MinValue: number | null;
    MaxValue: number | null;
    DenomType: string;
    stockAvailable: boolean;
    Category: string[];
    Descriptions: string;
    tnc: string;
    importantInstruction: string;
    EpayMinValue: number;
    EpayMaxValue: number;
    EpayDiscount: number;
    sku: string;
  } = {
    onboardingType: 'EXCEL',
    BrandProductCode: '',
    BrandName: '',
    Brandtype: 'VOUCHER',
    RedemptionType: '2',
    OnlineRedemptionUrl: '',
    BrandImage: '',
    denominationList: '',
    MinValue: null,
    MaxValue: null,
    DenomType: 'F',
    stockAvailable: true,
    Category: [],
    Descriptions: '',
    tnc: '',
    importantInstruction: '',
    EpayMinValue: 0,
    EpayMaxValue: 0,
    EpayDiscount: 0,
    sku: ''
  };

  categories = ['Food & Beverages', 'Lifestyle', 'E-Commerce', 'Fashion', 'Electronics'];

  apiSample = `POST /api/brands
Content-Type: application/json

{
  "BrandName": "Nike",
  "Category": "Retail",
  "OnlineRedemptionUrl": "https://nike.com",
  "EpayMinValue": 10,
  "EpayMaxValue": 500
}`;

  apiProfiles: ApiProfile[] = [
    {
      id: 'gyftr_v1',
      name: 'GyFTR - v1',
      description: 'Token based flow for brand and voucher data.',
      endpoints: [
        { name: 'Get Token', type: 'auth', method: 'GET', url: '/API/v1/gettoken', apiKey: '', requestSecret: '' },
        { name: 'Get Brands', type: 'data', method: 'POST', url: '/API/v1/getbrands', apiKey: '', requestSecret: '' }
      ]
    },
    {
      id: 'pine_labs_v2',
      name: 'Pine Labs - v2',
      description: 'OAuth authentication followed by catalog sync.',
      endpoints: [
        { name: 'OAuth Token', type: 'auth', method: 'POST', url: '/oauth/token', apiKey: '', requestSecret: '' },
        { name: 'Get Brand Catalog', type: 'data', method: 'GET', url: '/v2/catalog/brands', apiKey: '', requestSecret: '' }
      ]
    },
    {
      id: 'woohoo_v3',
      name: 'Woohoo - v3',
      description: 'API key and secret based partner integration.',
      endpoints: [
        { name: 'Partner Auth', type: 'auth', method: 'POST', url: '/partner/authenticate', apiKey: '', requestSecret: '' },
        { name: 'Fetch Brands', type: 'data', method: 'GET', url: '/partner/brands', apiKey: '', requestSecret: '' }
      ]
    }
  ];

  selectedApiProfileId = this.apiProfiles[0].id;
  selectedApiProfileDescription = this.apiProfiles[0].description;
  apiEndpoints: ApiEndpointConfig[] = this.cloneEndpoints(this.apiProfiles[0].endpoints);
  pullInProgress = false;
  pullMessage = '';
  lastPulledAt = '';

  constructor(
    private dialogRef: MatDialogRef<ClientBrandDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.mode === 'update') {
      this.title = 'Update Brand';
    }

    if (data?.brand) {
      this.brand = {
        ...this.brand,
        ...data.brand,
        Category: Array.isArray(data.brand.categories)
          ? data.brand.categories
          : (data.brand.Category || '').split(',').filter((x: string) => !!x)
      };
      if (data.brand.onboardingType === 'API') this.activeTab = 'api';
      if (data.brand.onboardingType === 'EXCEL') this.activeTab = 'excel';
    }
  }

  get isSkuValid(): boolean {
    return true;
  }

  switchTab(tab: TabType) {
    this.activeTab = tab;
    if (tab === 'excel') this.brand.onboardingType = 'EXCEL';
    if (tab === 'api') {
      this.brand.onboardingType = 'API';
      this.onApiProfileChange(this.selectedApiProfileId);
    }
  }

  toggleCategory(cat: string) {
    const i = this.brand.Category.indexOf(cat);
    i >= 0 ? this.brand.Category.splice(i, 1) : this.brand.Category.push(cat);
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) console.log('Excel selected:', file.name);
  }

  onApiProfileChange(profileId: string) {
    const profile = this.apiProfiles.find((item) => item.id === profileId);
    if (!profile) {
      return;
    }
    this.selectedApiProfileId = profile.id;
    this.selectedApiProfileDescription = profile.description;
    this.apiEndpoints = this.cloneEndpoints(profile.endpoints);
    this.pullMessage = '';
  }

  addEndpoint(type: ApiEndpointType) {
    this.apiEndpoints.push({
      name: type === 'auth' ? 'Auth Endpoint' : 'Data Endpoint',
      type,
      method: type === 'auth' ? 'POST' : 'GET',
      url: '',
      apiKey: '',
      requestSecret: ''
    });
  }

  removeEndpoint(index: number) {
    this.apiEndpoints.splice(index, 1);
  }

  pullFromApi() {
    if (!this.apiEndpoints.length) {
      this.pullMessage = 'Add at least one endpoint before pulling data.';
      return;
    }

    this.pullInProgress = true;
    this.pullMessage = 'Pulling brand data from API...';

    setTimeout(() => {
      this.pullInProgress = false;
      this.lastPulledAt = new Date().toISOString();
      this.pullMessage = `Pull completed successfully at ${new Date(this.lastPulledAt).toLocaleString()}.`;
    }, 900);
  }

  save() {
    this.dialogRef.close({
      ...this.brand,
      categories: this.brand.Category,
      activeTab: this.activeTab,
      apiIntegration: this.activeTab === 'api' ? {
        profileId: this.selectedApiProfileId,
        endpoints: this.apiEndpoints,
        lastPulledAt: this.lastPulledAt
      } : null
    });
  }

  close() {
    this.dialogRef.close();
  }

  private cloneEndpoints(endpoints: ApiEndpointConfig[]): ApiEndpointConfig[] {
    return endpoints.map((endpoint) => ({ ...endpoint }));
  }
}
