import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor() { 
    console.log("Callback PAGE");
    console.log("callback page is calling postMessage");
    window.parent.postMessage("Close-RX", "*");
    localStorage.setItem("Close-RX", "true");
  }

  ngOnInit(): void {
  }

}
