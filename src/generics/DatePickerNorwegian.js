import React, { Component } from 'react';
import DatePicker from 'material-ui/DatePicker';

import moment from 'moment';

class DatePickerNorwegian extends Component {
    render () {
        return (
            <div>
                <DatePicker 
                    {...this.props}
                    autoOk={true}
                    formatDate={date => moment(date).format("L")}
                    cancelLabel="Avbryt"
                />
            </div>
        )
    }
}

export default DatePickerNorwegian;