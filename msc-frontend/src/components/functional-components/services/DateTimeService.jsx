import React, { Component } from 'react';

const DateTimeService = (calls, parameter) => {
    
    const convertToDateTime = (timestamp) => {
        const datetime = new Date(timestamp);
        let date = datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
        let time = datetime.getHours() + ':';
        if(datetime.getMinutes() == 0) time = time + datetime.getMinutes() + '0';
        else if(datetime.getMinutes() < 10) time = time + '0' + datetime.getMinutes();
        else time = time + datetime.getMinutes();
        return ({
            datetime: datetime,
            date: date,
            time: time
        });
    }

    const compareTwoDates = (compareObj) => {
        let value1 = compareObj.value1; // tempDate
        let value2 = compareObj.value2; // currDate
        let flag = false;
        if(value1.getFullYear() < value2.getFullYear()) flag = true;
        else if(value1.getFullYear() == value2.getFullYear()){
        if(value1.getMonth() < value2.getMonth()) flag = true;
        else if(value1.getMonth() == value2.getMonth()){
          if(value1.getDate() < value2.getDate()) flag = true;
        }
        return flag;
      }
    }

    if(calls == "convertToDateTime") return convertToDateTime(parameter);
    if(calls == "compareTwoDates") return compareTwoDates(parameter);
}

export default DateTimeService;