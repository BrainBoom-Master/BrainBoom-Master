import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventInput,
  formatDate,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../../components/Pai/Header";
import { tokens } from "../../../theme";
import React from "react";
import { Button, notification } from "antd";
import Headerside from "../../Pai/ADD/Header";
import HeaderandSidebar from "../../Pai/ADD/Sidebar";
import "../Dashboard/apptest.css"

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);

  // ฟังก์ชันจัดการเมื่อคลิกเลือกวันที่ในปฏิทิน
  const handleDateClick = (selected: DateSelectArg) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.startStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  // ฟังก์ชันจัดการเมื่อคลิกที่เหตุการณ์ในปฏิทิน
  const handleEventClick = (selected: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };

  const [openSidebarToggle, setOpenSidebarToggle] = useState<boolean>(false);

  const OpenSidebar = (): void => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Headerside OpenSidebar={OpenSidebar} />
      <HeaderandSidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <Box sx={{ width: "80vw", height: "70vh", m: "20px" }}>
        {" "}
        {/* ใช้ 100vw และ 100vh สำหรับความกว้างและความสูง */}
        <Header title="Calendar" subtitle="Full Calendar Interactive Page" />
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ height: "100%" }}
        >
          {" "}
          {/* ตั้งค่า container ให้สูง 100% */}
          {/* CALENDAR SIDEBAR */}
          <Box
            flex="1 1 20%"
            sx={{
              backgroundColor: colors.primary[400],
              p: "15px",
              borderRadius: "4px",
              height: "100%",
            }} // Sidebar สูงเต็มจอ
          >
            <Typography variant="h5">Events</Typography>
            <List>
              {currentEvents.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <Typography>
                        {event.start
                          ? formatDate(event.start, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "No Date"}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          {/* CALENDAR */}
          <Box flex="1 1 80%" ml="15px" sx={{ height: "100%" }}>
            {" "}
            {/* ปรับ Calendar ให้เต็มความสูง */}
            <FullCalendar
              height="100%" // ตั้งค่า Calendar ให้สูงเต็มพื้นที่
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              eventsSet={(events) => setCurrentEvents(events)}
              initialEvents={
                [
                  {
                    id: "12315",
                    title: "All-day event",
                    date: "2022-09-14",
                  },
                  {
                    id: "5123",
                    title: "Timed event",
                    date: "2022-09-28",
                  },
                ] as EventInput[]
              }
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Calendar;
