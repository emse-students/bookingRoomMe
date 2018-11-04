import {Component, Input, OnInit} from '@angular/core';
import {Session} from '../../../auth/models/auth.model';
import {Room} from '../../models/room.model';
import {FormControl} from '@angular/forms';
import {DateService} from '../../../core/services/date.service';
import {PostRoomReservation} from '../../actions/reservation.actions';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../core/reducers';

@Component({
  selector: 'brme-special-booker',
  templateUrl: './special-booker.component.html',
  styleUrls: ['./special-booker.component.scss']
})
export class SpecialBookerComponent implements OnInit {
  startDate;
  startHours;
  startMins;
  endDate;
  endHours;
  endMins;
  hours;
  minutes;
  recurrent = false;
  recurrentWeeks;
  @Input() currentUser: Session | null;
  @Input() currentRoom: Room | null;
  @Input() pending: boolean;
  @Input()
  set currentDate(time: number | null) {
    if ( time === null ) {
      this.startDate = new Date();
      this.endDate = new Date(this.startDate.getTime() + 30 * 60 * 1000);
    } else {
      this.startDate = new Date(time * 1000);
      this.endDate = new Date((time + 30 * 60) * 1000);
    }
    this.startHours = this.startDate.getHours();
    this.startMins = Math.floor(this.startDate.getMinutes() / 30) * 30;
    this.startDate.setMinutes(this.startMins);
    this.startDate.setSeconds(0);
    this.startDate.setMilliseconds(0);
    this.setRecurrentWeeks();

    this.endHours = this.endDate.getHours();
    this.endMins = Math.floor(this.endDate.getMinutes() / 30) * 30;
    this.endDate.setMinutes(this.endMins);
    this.endDate.setSeconds(0);
    this.endDate.setMilliseconds(0);
  }


  constructor(private dateService: DateService, private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.hours = Array.from(new Array(24), (val, index) => index);
  }

  setStartDate(value: Date) {
    const startDay = new Date(this.startDate.getTime());
    startDay.setHours(0);
    startDay.setMinutes(0);
    startDay.setSeconds(0);
    startDay.setMilliseconds(0);
    const time = this.startDate.getTime() - startDay.getTime();
    this.startDate = new Date(value.getTime() + time);
    this.setRecurrentWeeks();
  }

  setEndDate(value: Date) {
    const endDay = new Date(this.endDate.getTime());
    endDay.setHours(0);
    endDay.setMinutes(0);
    endDay.setSeconds(0);
    endDay.setMilliseconds(0);
    const time = this.endDate.getTime() - endDay.getTime();
    this.endDate = new Date(value.getTime() + time);
  }

  refresh() {
    this.startDate = new Date(this.startDate.getTime());
    this.endDate = new Date(this.endDate.getTime());
  }

  book() {
    if (this.recurrent) {
      for (let i = 0; i < this.recurrentWeeks.length; i++) {
        if (this.recurrentWeeks[i].booked) {
          for (let j = Math.floor(this.startDate.getTime() / 1000); j < Math.floor(this.endDate.getTime() / 1000); j = j + 30 * 60) {
            this.store.dispatch(new PostRoomReservation({
              userId: this.currentUser.id,
              roomId: this.currentRoom.id,
              startTime: j + i * 7 * 24 * 60 * 60
            }));
          }
        }
      }
    } else {
      for (let i = Math.floor(this.startDate.getTime() / 1000); i < Math.floor(this.endDate.getTime() / 1000); i = i + 30 * 60) {
        this.store.dispatch(new PostRoomReservation({userId: this.currentUser.id, roomId: this.currentRoom.id, startTime: i}));
      }
    }
  }

  setRecurrentWeeks() {
    this.recurrentWeeks = [];
    const startTime = this.dateService.getLastMonday(Math.floor(this.startDate.getTime() / 1000)) * 1000;
    for (let i = 0; i < 50; i++) {
      this.recurrentWeeks.push(
        {
          start: new Date(startTime + 7 * 24 * 60 * 60 * 1000 * i),
          end: new Date(startTime + 7 * 24 * 60 * 60 * 1000 * (i + 1)),
          booked: i === 0
        });
    }
  }

}
