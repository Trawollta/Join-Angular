import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';


@Injectable({
  providedIn: 'root'
})
export class AnimationsService {

  constructor() { }


  openOverlay(): void {
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'block';
    }
  }

  openSidenav(sidenav: MatSidenav): void {
    sidenav.open();
  }

  closeSidenav(sidenav: MatSidenav): void {
    sidenav.close();
  }
}
