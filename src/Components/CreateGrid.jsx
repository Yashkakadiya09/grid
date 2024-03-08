import { useRef, useState } from "react";

import "flatpickr/dist/themes/material_green.css";
import DatePicker from "react-datepicker";

const DatePickerComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });
 

  const ref = useRef(null);
  const handleStartDateChange = (dateStr) => {
   
    if (!dateRange?.start) {
      setDateRange({ ...dateRange, start: dateStr });
    } else {
      if (new Date(dateStr) > new Date(dateRange?.end)) {
        setDateRange({ end: null, start: dateStr });
        // setRoomTypeObj([]);
        // setTotalDate();
        // setTotal([]);
      } else {
        setDateRange({ ...dateRange, start: dateStr });
        // handleObj(dateStr, dateRange?.end);
      }
    }
  };

  const handleChange = (selectedDates) => {
    const inputValue = ref.current
      ? ref.current
      : document.getElementById("raj").value;

    const isValidDateFormat = /^\d{2}\/\d{2}\/\d{4}$/.test(inputValue);
    
    if (isValidDateFormat) {
      handleStartDateChange(selectedDates);
      ref.current = null;
    } else {
      console.log("Invalid date format");
      ref.current = null;
    }
    setSelectedDate(selectedDates);
  };
  const handleSelect = (date) => {
    ref.current = date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div>
      <DatePicker
        id="raj"
        selected={selectedDate}
        onDayMouseEnter={handleSelect}
        onChange={(date) => {
          handleChange(date);
        }}
        placeholder="Select Date"
      />
    </div>
  );
};

export default DatePickerComponent;
