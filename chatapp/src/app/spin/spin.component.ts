import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from '../_services';

@Component({
  selector: 'app-spin',
  templateUrl: './spin.component.html',
  styleUrls: ['./spin.component.scss']
})
export class SpinComponent implements OnInit {

    showSpinner = false;
  constructor(private spinnerService: SpinnerService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.init();
  }

  init() {
    
      this.spinnerService.getSpinnerObserver().subscribe((status) => {
          this.showSpinner = (status === 'start');
          this.cdRef.detectChanges();
      });
  }
}
