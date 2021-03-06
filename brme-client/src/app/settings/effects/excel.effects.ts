import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, exhaustMap, map, switchMap} from 'rxjs/operators';
import {ExcelService} from '../../core/services/excel.service';
import {
  DeleteExcel, DeleteExcelSuccess,
  ExcelAdminSettingsActionTypes,
  ExcelFailure,
  ParseExcel,
  ParseExcelSuccess,
  UploadExcel,
  UploadExcelSuccess
} from '../actions/excel.actions';
import {Excel} from '../models/excel.model';
import {GetRoomReservations, ReservationActionTypes, SetDate} from '../../bookings/actions/reservation.actions';


@Injectable()
export class ExcelAdminSettingsEffects {

  @Effect()
  uploadexcel$ = this.actions$.pipe(
    ofType<UploadExcel>(ExcelAdminSettingsActionTypes.UploadExcel),
    map(action => action.payload),
    exhaustMap((excel: Excel) =>
      this.excelService.upload(excel).pipe(
        map(newexcel => new UploadExcelSuccess( {excel: newexcel, add: excel.suppr})),
        catchError(error => of(new ExcelFailure(error)))
      )
    )
  );

  @Effect()
  uploadsuccess$ = this.actions$.pipe(
    ofType<UploadExcelSuccess>(ExcelAdminSettingsActionTypes.UploadExcelSuccess),
    map(action => new ParseExcel({id: action.payload.excel.id, add: action.payload.add}))
  );

  @Effect()
  parseexcel$ = this.actions$.pipe(
    ofType<ParseExcel>(ExcelAdminSettingsActionTypes.ParseExcel),
    map(action => action.payload),
    exhaustMap((payload) =>
      this.excelService.parse(payload.id, payload.add).pipe(
        switchMap((ids: number[]) => {
            return this.excelService.setPwd(ids).pipe(
              map(success => new ParseExcelSuccess(payload.id)),
              catchError(error => of(new ExcelFailure(error))));
        }),
        catchError(error => of(new ExcelFailure(error)))
      )
    )
  );

  @Effect()
  parsesuccess$ = this.actions$.pipe(
    ofType<ParseExcelSuccess>(ExcelAdminSettingsActionTypes.ParseExcelSuccess),
    map(action => new DeleteExcel(action.payload))
  );

  @Effect()
  deleteexcel$ = this.actions$.pipe(
    ofType<DeleteExcel>(ExcelAdminSettingsActionTypes.DeleteExcel),
    map(action => action.payload),
    exhaustMap((id: number) =>
      this.excelService.delete(id).pipe(
        map(success => new DeleteExcelSuccess( id )),
        catchError(error => of(new ExcelFailure(error)))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private excelService: ExcelService
  ) {}
}
