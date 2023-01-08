import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  transform(value: any) : string[] {
    if(!(typeof value === "object") || value === null) return value
    return Object.keys(value)
  }
}
