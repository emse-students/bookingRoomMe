import {Component, Input, OnInit} from '@angular/core';
import {Session} from '../../../auth/models/auth.model';
import {Room} from '../../models/room.model';

@Component({
  selector: 'brme-special-booker',
  templateUrl: './special-booker.component.html',
  styleUrls: ['./special-booker.component.scss']
})
export class SpecialBookerComponent implements OnInit {
  @Input() currentUser: Session | null;
  @Input() currentRoom: Room | null;
  @Input() currentDate: number | null;

  constructor() { }

  ngOnInit() {
  }

}
