import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Common {

    constructor() { }

    /**
     * setHoursNMiniutes
     */
    setHoursNMiniutes(time) {

        var newTime = '00';
        if(time.toString().length == 1){

            newTime = '0' + time;
        } else {
            
            newTime = time.toString();
        }

        return newTime;
    }
}