import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TabViewModule } from 'primeng/tabview';
import { jwtDecode } from 'jwt-decode';
import { PowerBiService } from '../../../Services/appServices/powerbi/power-bi.service';

@Component({
  selector: 'app-power-bi-viewer',
  standalone: true,
  imports: [CommonModule, TabViewModule],
  templateUrl: './power-bi-viewer.component.html',
  styleUrls: ['./power-bi-viewer.component.css']
})
export class PowerBiViewerComponent implements OnInit {
  dashboards: any[] = [];
  userId: number = 0;
  sanitizedUrls: { [key: number]: SafeResourceUrl } = {};

  constructor(
    private powerBiService: PowerBiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.extractUser();
    this.loadMyDashboards();
  }

  extractUser() {
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.id;
    }
  }

  loadMyDashboards() {
    if (!this.userId) return;
    this.powerBiService.getUserDashboards(this.userId).subscribe({
      next: (data: any) => {
        this.dashboards = data;
        this.processUrls();
      },
      error: (err: any) => console.error('Error cargando tableros:', err)
    });
  }

  processUrls() {
    this.dashboards.forEach(dash => {
      let finalUrl = dash.url_iframe;
      
      // Si el usuario pegó el código de iframe completo, extraer el src
      if (finalUrl.includes('<iframe') && finalUrl.includes('src="')) {
        const match = finalUrl.match(/src="([^"]+)"/);
        if (match && match[1]) {
          finalUrl = match[1];
        }
      }

      this.sanitizedUrls[dash.id] = this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
    });
  }
}
