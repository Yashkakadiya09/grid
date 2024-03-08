import React, { useRef, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

function Grid() {
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });

  const startRef = useRef(null);

  const endRef = useRef(null);
  const [total, setTotal] = useState([]);
  const [totalDate, setTotalDate] = useState();
  const [roomTypeObj, setRoomTypeObj] = useState([]);
  const datewarning = () => toast.warning("Select First StartDate");
  const roomtypeWarning = () => toast.error("Select First RoomType");

  const handleStartDateChange = (dateStr) => {
    if (!dateRange?.start) {
      setDateRange({ ...dateRange, start: dateStr });
    } else {
      if (new Date(dateStr) > new Date(dateRange?.end)) {
        setDateRange({ end: null, start: dateStr });
        setRoomTypeObj([]);
        setTotalDate();
        setTotal([]);
      } else {
        setDateRange({ ...dateRange, start: dateStr });
        handleObj(dateStr, dateRange?.end);
      }
    }
  };
  const handleStartCheckChange = (selectedDates) => {
    const inputValue = startRef.current
      ? startRef.current
      : document.getElementById("start").value;

    const isValidDateFormat = /^\d{2}\/\d{2}\/\d{4}$/.test(inputValue);

    if (isValidDateFormat) {
      handleStartDateChange(selectedDates);
      startRef.current = null;
    } else {
      startRef.current = null;
    }
  };

  const handleStartSelect = (date) => {
    startRef.current = date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleEndDateChange = (dateStr) => {
    if (!dateRange?.start) {
      datewarning();
    } else {
      setDateRange({ ...dateRange, end: dateStr });
      handleObj(dateRange?.start, dateStr);
    }
  };

  const handleEndCheckChange = (selectedDates) => {
    const inputValue = endRef.current
      ? endRef.current
      : document.getElementById("end").value;

    const isValidDateFormat = /^\d{2}\/\d{2}\/\d{4}$/.test(inputValue);

    if (isValidDateFormat) {
      handleEndDateChange(selectedDates);
      endRef.current = null;
    } else {
      endRef.current = null;
    }
  };

  const handleEndSelect = (date) => {
    endRef.current = date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleObj = (start, end) => {
    let dates = [];
    let startDate = moment(start).format("MM/DD/YYYY");
    let endDate = moment(end).format("MM/DD/YYYY");

    while (
      moment(startDate, "MM/DD/YYYY").isSameOrBefore(endDate, "MM/DD/YYYY")
    ) {
      dates.push(moment(startDate, "MM/DD/YYYY").format("DD/MM/YYYY"));
      startDate = moment(startDate, "MM/DD/YYYY")
        .add(1, "days")
        .format("MM/DD/YYYY");
    }

    let array = [];
    let newdatearray = [];
    let updatedItem = [];

    for (let i = 0; i < dates.length; i++) {
      const element = dates[i];
      let findindex = roomTypeObj?.findIndex((data, i) => data);
      if (findindex >= 0) {
        roomTypeObj.map((item, itemindex) => {
          const matchingDates = item.date.find((dateObj) =>
            element.includes(dateObj.date)
          );

          let existroomtype = updatedItem?.findIndex(
            (data) => data.id === itemindex
          );

          if (existroomtype >= 0) {
            if (matchingDates) {
              updatedItem[existroomtype].date.push(matchingDates);
            } else {
              let newdate = {
                date: element,
                noofrooms: "",
                rate: "",
                anticipatedrevenue: "",
                actualpickup: "",
                actualrooms: "",
              };
              updatedItem[existroomtype].date.push(newdate);
            }
          } else {
            if (matchingDates) {
              let newobj = {
                id: itemindex,
                ...item,
                date: [matchingDates],
              };
              updatedItem.push(newobj);
            } else {
              let newobj = {
                id: itemindex,
                ...item,
                date: [
                  {
                    date: element,
                    noofrooms: "",
                    rate: "",
                    anticipatedrevenue: "",
                    actualpickup: "",
                    actualrooms: "",
                  },
                ],
              };
              updatedItem.push(newobj);
            }
          }
        });
        let date = {
          date: element,
          noofrooms: "",
          rate: "",
          anticipatedrevenue: "",
          actualpickup: "",
          actualrooms: "",
        };

        newdatearray.push(date);
        setTotalDate(newdatearray);
        // setTotalDate(newdatearray);
        setRoomTypeObj(updatedItem);
      } else {
        let date = {
          date: element,
          noofrooms: "",
          rate: "",
          anticipatedrevenue: "",
          actualpickup: "",
          actualrooms: "",
        };

        array.push(date);

        setTotalDate(array);
        setRoomTypeObj([
          {
            roomtype: "",
            peopleperroom: "",
            date: array,
          },
        ]);
      }
    }
  };

  const handleAddCol = () => {
    setRoomTypeObj([
      ...roomTypeObj,
      { roomtype: "", peopleperroom: "", date: totalDate },
    ]);
  };
  const handleDelete = (i) => {
    let filterObj = roomTypeObj?.filter((data, index) => index !== i);

    setRoomTypeObj(filterObj);
    Calculation(filterObj);
  };

  const handledrop = (e, roomindex) => {
    let { value, name } = e.target;

    let newArray = roomTypeObj?.map((data, i) => {
      if (i === roomindex) {
        data[name] = value === "false" ? "" : value;
      }
      return data;
    });
    setRoomTypeObj(newArray);
  };
  // console.log(roomTypeObj);
  //  for check number
  // const setvalue = (value) => {
  //   if (isNaN(parseInt(value))) {
  //     return "";
  //   } else {
  //     if (value.charAt(0) === "0") {
  //       value = value.slice(1);
  //       return parseInt(value);
  //     } else {
  //       return parseInt(value);
  //     }
  //   }
  // };

  const handlechange = (e, selectdate, roomindex) => {
    let { name, value } = e.target;

    let newArray = roomTypeObj?.map((data, index) => {
      if (index === roomindex) {
        return {
          ...data,
          date: data?.date?.map((date, i) => {
            if (selectdate === date?.date) {
              return {
                ...date,
                [name]: value,
              };
            }
            return date;
          }),
        };
      }
      return data;
    });

    Calculation(newArray);
  };
  const Calculation = (data) => {
    let newData = [...data];
    if (newData.length > 0) {
      var TotalnewData = JSON.parse(JSON.stringify(newData[0]));

      for (let index1 = 0; index1 < TotalnewData.date.length; index1++) {
        // debugger
        TotalnewData.date[index1]["anticipatedrevenue"] = 0;
        TotalnewData.date[index1]["rate"] = 0;
        TotalnewData.date[index1]["noofrooms"] = 0;

        TotalnewData.date[index1]["roomtype"] = "";
        TotalnewData.date[index1]["peopleperroom"] = 0;
        TotalnewData.date[index1]["actualpickup"] = 0;
        TotalnewData.date[index1]["actualrooms"] = 0;
      }
    }

    for (let index = 0; index < newData.length; index++) {
      const element = newData[index];
      for (let index1 = 0; index1 < element.date.length; index1++) {
        element.date[index1]["anticipatedrevenue"] =
          (element.date[index1]["rate"]
            ? parseInt(element.date[index1]["rate"])
            : 0) *
          (element.date[index1]["noofrooms"]
            ? parseInt(element.date[index1]["noofrooms"])
            : 0);

        TotalnewData.date[index1]["anticipatedrevenue"] =
          TotalnewData.date[index1]["anticipatedrevenue"] +
          (element.date[index1]["anticipatedrevenue"]
            ? parseInt(element.date[index1]["anticipatedrevenue"])
            : 0);

        TotalnewData.date[index1]["rate"] =
          TotalnewData.date[index1]["rate"] +
          (element.date[index1]["rate"]
            ? parseInt(element.date[index1]["rate"])
            : 0);

        TotalnewData.date[index1]["noofrooms"] =
          TotalnewData.date[index1]["noofrooms"] +
          (element.date[index1]["noofrooms"]
            ? parseInt(element.date[index1]["noofrooms"])
            : 0);
        TotalnewData.date[index1]["actualrooms"] =
          TotalnewData.date[index1]["actualrooms"] +
          (element.date[index1]["actualrooms"]
            ? parseInt(element.date[index1]["actualrooms"])
            : 0);
        TotalnewData.date[index1]["peopleperroom"] =
          TotalnewData.date[index1]["peopleperroom"] +
          (element.date[index1]["peopleperroom"]
            ? parseInt(element.date[index1]["peopleperroom"])
            : 0);

        TotalnewData.date[index1]["actualpickup"] +=
          (element.date[index1]["rate"]
            ? parseInt(element.date[index1]["rate"])
            : 0) *
          (element.date[index1]["actualpickup"]
            ? parseInt(element.date[index1]["actualpickup"])
            : 0);
      }
    }
    setRoomTypeObj(newData);
    setTotal([TotalnewData]);
  };

  const handleClick = () => {
    let findindex = roomTypeObj?.findIndex((data, i) => data?.roomtype === "");
    if (findindex >= 0) {
      roomtypeWarning();
    } else {
      console.log(roomTypeObj);
      console.log(total);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          marginTop: "5vw",
          justifyContent: "center",
          gap: "5vw",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h6>Check In Date:</h6>
            <i className="ri-calendar-2-line"></i>
          </div>
          <DatePicker
            id="start"
            selected={dateRange.start}
            onDayMouseEnter={handleStartSelect}
            onChange={(date) => {
              handleStartCheckChange(date);
            }}
            placeholderText="MM/DD/YYYY"
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h6>Check Out Date:</h6>
            <i className="ri-calendar-2-line"></i>
          </div>
          <DatePicker
            id="end"
            selected={dateRange.end}
            onDayMouseEnter={handleEndSelect}
            minDate={dateRange.start}
            onChange={(date) => {
              handleEndCheckChange(date);
            }}
            placeholderText="MM/DD/YYYY"
          />
        </div>
      </div>

      {totalDate?.length > 0 ? (
        <>
       
          <div
            style={{
              margin: "2vw",
              overflow: "scroll",
            }}
          >
            <table className="table table-bordered border-danger">
              <thead>
                <tr>
                  <th scope="col" colSpan="2">
                    <button
                      onClick={() => handleAddCol()}
                      className="btn btn-warning mx-5 px-4"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </th>
                  {totalDate?.map((data, i) => {
                    return (
                      <th
                        colSpan="5"
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {data?.date}
                      </th>
                    );
                  })}
                  <th
                    rowSpan="2"
                    style={{
                      verticalAlign: "center",
                    }}
                  >
                    Action
                  </th>
                </tr>
                <tr>
                  <th>Room Type</th>
                  <th>People per Room</th>
                  {totalDate?.map((data, i) => {
                    return (
                      <>
                        <th>NO OF ROOMS</th>
                        <th>RATE($)</th>
                        <th>ANTICIPATED REVENUE($)</th>
                        <th>ACTUAL PICKUP</th>
                        <th>ACTUAL ROOMS</th>
                      </>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {roomTypeObj?.map((data, roomtypeindex) => {
                  return (
                    <tr>
                      <td>
                        <select
                          name="roomtype"
                          value={data?.roomtype}
                          onChange={(e) => handledrop(e, roomtypeindex)}
                        >
                          <option value={false}> Select RoomType</option>
                          <option value="King Executive Suite">
                            King Executive Suite
                          </option>
                          <option value="Two Bedroom 1K/1K">
                            Two Bedroom 1K/1K{" "}
                          </option>
                          <option value="King Suite ">King Suite </option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="peopleperroom"
                          placeholder="0"
                          pattern="[0-9]*"
                          value={data?.peopleperroom}
                          style={{
                            width: "4vw",
                          }}
                          onChange={(e) => {
                            if (e.target.validity.valid) {
                              handledrop(e, roomtypeindex);
                            }
                          }}
                        />
                      </td>

                      {data?.date?.map((date, i) => {
                        return (
                          <>
                            <td>
                              <input
                                key={date?.date}
                                disabled={
                                  data?.date?.length === i + 1 ? true : false
                                }
                                name="noofrooms"
                                type="text"
                                value={date?.noofrooms}
                                pattern="[0-9]*"
                                placeholder="0"
                                style={{
                                  width: "5vw",
                                }}
                                onChange={(e) => {
                                  if (e.target.validity.valid) {
                                    handlechange(e, date?.date, roomtypeindex);
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="rate"
                                placeholder="0"
                                disabled={
                                  data?.date?.length === i + 1 ? true : false
                                }
                                pattern="^\d*(\.\d{0,2})?$"
                                maxLength={21}
                                value={date?.rate}
                                style={{
                                  width: "5vw",
                                }}
                                onChange={(e) => {
                                  if (e.target.validity.valid) {
                                    handlechange(e, date?.date, roomtypeindex);
                                  }
                                }}
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                name="anticipatedrevenue"
                                placeholder="0"
                                pattern="[0-9]*"
                                disabled
                                value={date?.noofrooms * date?.rate}
                                style={{
                                  width: "5vw",
                                }}
                                onChange={(e) => {
                                  if (e.target.validity.valid) {
                                    handlechange(e, date?.date, roomtypeindex);
                                  }
                                }}
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                name="actualpickup"
                                placeholder="0"
                                pattern="[0-9]*"
                                disabled={
                                  data?.date?.length === i + 1 ? true : false
                                }
                                value={date?.actualpickup}
                                style={{
                                  width: "5vw",
                                }}
                                onChange={(e) => {
                                  if (e.target.validity.valid) {
                                    handlechange(e, date?.date, roomtypeindex);
                                  }
                                }}
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                name="actualrooms"
                                placeholder="0"
                                value={date?.actualrooms}
                                disabled={
                                  data?.date?.length === i + 1 ? true : false
                                }
                                pattern="[0-9]*"
                                style={{
                                  width: "5vw",
                                }}
                                onChange={(e) => {
                                  if (e.target.validity.valid) {
                                    handlechange(e, date?.date, roomtypeindex);
                                  }
                                }}
                              />
                            </td>
                          </>
                        );
                      })}

                      <td>
                        <button
                          onClick={() => handleDelete(roomtypeindex)}
                          className="btn btn-outline-danger"
                        >
                          <i className="ri-delete-bin-5-line"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <th colSpan="2">Total</th>

                  {totalDate?.map((data, i) => {
                    let finddate = total[0]?.date?.find(
                      (item, i) => data?.date === item?.date
                    );

                    return finddate ? (
                      <>
                        <td>{finddate?.noofrooms}</td>
                        <td>{finddate?.rate}</td>
                        <td>{finddate?.anticipatedrevenue}</td>
                        <td>{finddate?.actualpickup}</td>
                        <td>{finddate?.actualrooms}</td>
                      </>
                    ) : (
                      <>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                margin: "3vw 2vw",
              }}
            >
              <button className="btn btn-success" onClick={() => handleClick()}>
                Submit
              </button>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Grid;
