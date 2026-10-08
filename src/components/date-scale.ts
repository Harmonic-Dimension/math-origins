import type { HistoricalDate } from '../schema';
export function dateExtent(date:HistoricalDate):[number,number]|null {
  return date.precision==='unknown'?null:date.precision==='range'?[date.start,date.end]:[date.year,date.year];
}
export function datePosition(year:number,min:number,max:number) {
  return max===min?50:100*(year-min)/(max-min);
}
