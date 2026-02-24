import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Store { id: string; code: string; name: string; city: string; state: string; status: 'Active'|'Inactive'; address?: string; phone?: string; lat?: number; lng?: number; expanded?: boolean }

@Component({
  selector: 'app-store-locator',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.css']
})
export class StoreLocatorComponent implements OnInit {
  title = 'Store Locator';
  subtitle = 'Find stores where your voucher can be redeemed';

  loading = true;
  error: string | null = null;

  // sample brands + stores (replace with API later)
  brands = [
    { id: 'b1', name: 'Acme Stores' },
    { id: 'b2', name: 'Techify' }
  ];

  stores: Store[] = [
    { id: 's1', code: 'W029', name: 'Westside – Iscon Mall', city: 'Ahmedabad', state: 'Gujarat', status: 'Active', address: '1 Iscon Mall Road', phone: '+91-79-0000', lat: 23.0225, lng: 72.5714 },
    { id: 's2', code: 'A120', name: 'Alpha Outlet', city: 'Ahmedabad', state: 'Gujarat', status: 'Inactive', address: '88 Ellisbridge', phone: '+91-79-1111', lat: 23.0280, lng: 72.5240 },
    { id: 's3', code: 'M012', name: 'Metro Plaza', city: 'Surat', state: 'Gujarat', status: 'Active', address: 'Market Road', phone: '+91-261-2222', lat: 21.1702, lng: 72.8311 }
  ];

  filtered = this.stores.slice();

  // filters
  searchCity = '';
  selectedBrand: string | null = null;

  // map selection
  selectedStoreId: string | null = null;

  // responsive
  isMobileView = false;
  showMapOnMobile = false;

  // view: list | table | map - default to table-only mode
  view: 'list'|'table'|'map' = 'table';

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => { this.loading = false; this.filtered = this.stores.slice(); }, 300);
    this.updateViewport();
  }

  @HostListener('window:resize') updateViewport() {
    this.isMobileView = window.innerWidth <= 760;
    if (!this.isMobileView) this.showMapOnMobile = false;
  }

  clearFilters() {
    this.searchCity = '';
    this.selectedBrand = null;
    this.applyFilters();
  }

  applyFilters() {
    const city = (this.searchCity || '').trim().toLowerCase();
    // preserve expanded state on original store objects
    this.filtered = this.stores.filter(s => {
      const matchCity = !city || s.city.toLowerCase().includes(city);
      const matchBrand = !this.selectedBrand || this.selectedBrand === 'b1' ? true : true; // placeholder
      return matchCity && matchBrand;
    });
  }

  toggleExpand(s: Store) {
    s.expanded = !s.expanded;
  }

  selectStore(s: Store) {
    this.selectedStoreId = s.id;
    if (this.isMobileView) this.showMapOnMobile = true;
    // in real map, we'd center/zoom to lat/lng
  }

  setView(v: 'list'|'table'|'map'){
    this.view = v;
  }

  // city suggestions for a simple autocomplete
  get citySuggestions(): string[]{
    const cities = Array.from(new Set(this.stores.map(s => s.city)));
    const q = (this.searchCity||'').toLowerCase();
    return cities.filter(c => c.toLowerCase().includes(q));
  }

  storeMarkerClick(s: Store) {
    this.selectStore(s);
    // scroll list into view
    const el = document.getElementById('store-' + s.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // helper to position pseudo-markers on the placeholder map
  getMapPos(s: Store) {
    // normalize lat/lng to 0-100% using min/max from current data
    const lats = this.stores.map(x => x.lat ?? 0);
    const lngs = this.stores.map(x => x.lng ?? 0);
    const minLat = Math.min(...lats); const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs); const maxLng = Math.max(...lngs);
    const top = maxLat === minLat ? 50 : 10 + ((maxLat - (s.lat ?? 0)) / (maxLat - minLat)) * 80;
    const left = maxLng === minLng ? 50 : 10 + (((s.lng ?? 0) - minLng) / (maxLng - minLng)) * 80;
    return { top: Math.max(6, Math.min(94, top)), left: Math.max(6, Math.min(94, left)) };
  }

  goToPull(s: Store) {
    // example: navigate to pull screen with store context
    this.router.navigate(['superadmin','voucher','pull'], { queryParams: { storeId: s.id } });
  }
}
