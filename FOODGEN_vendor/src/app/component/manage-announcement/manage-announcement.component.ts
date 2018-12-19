import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-announcement',
  templateUrl: './manage-announcement.component.html',
  styleUrls: ['./manage-announcement.component.css']
})
export class ManageAnnouncementComponent implements OnInit {
  selected;
  history;
  constructor() { }

  ngOnInit() {
  }

}
