import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import {
  DateSelectArg,
  EventClickArg,
  EventInput,
  formatDate,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
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
import { Modal, Input, message } from "antd"; 
import Header from "../../../components/Chart/Header";
import { tokens } from "../../../theme";
import { GetTask, createTask, deleteTask } from "../../../services/https";
import Headerside from "../ADD/Header";
import HeaderandSidebar from "../ADD/Sidebar";
import "../Dashboard/apptest.css";
import { Task } from "../../../interfaces/task";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [eventToDelete, setEventToDelete] = useState<EventClickArg | null>(null);

  // ฟังก์ชันสำหรับดึงข้อมูล tasks
  const fetchTasks = async () => {
    try {
      const response = await GetTask();
      if (response && response.data) {
        const events: EventInput[] = response.data.map(
          (task: { title: string; start_date: string; id?: number }) => ({
            id: task.id || task.title,
            title: task.title,
            start: new Date(task.start_date),
            allDay: true,
          })
        );
        setCurrentEvents(events);
      }
    } catch (error) {
      message.error("Failed to load tasks");
    }
  };

  // ใช้ useEffect เพื่อเรียก fetchTasks เมื่อ component ติดตั้ง
  useEffect(() => {
    fetchTasks();

    const interval = setInterval(() => {
      fetchTasks(); // ดึงข้อมูลทุกๆ 5 วินาที
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // เปิด Modal เมื่อเลือกวันที่
  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsModalVisible(true);
  };

  // ฟังก์ชันจัดการการสร้างภารกิจ
  const handleCreateTask = async () => {
    if (!modalTitle.trim()) {
      message.warning("Please enter a title for the event.");
      return;
    }

    const calendarApi = selectedDate?.view.calendar;
    if (!calendarApi) return;

    const newTask: Omit<Task, "id"> = {
      title: modalTitle,
      startDate: new Date(selectedDate!.startStr),
      endDate: new Date(selectedDate!.endStr || selectedDate!.startStr),
      allDay: selectedDate!.allDay,
      userId: 1, // ตัวอย่าง userId, สามารถทำให้เป็น dynamic ได้
    };

    try {
      const result = await createTask(newTask);

      if (result) {
        calendarApi.addEvent({
          id: result.id.toString(),
          title: result.title,
          start: result.startDate,
          end: result.endDate,
          allDay: result.allDay,
        });

        setCurrentEvents((prev) => [
          ...prev,
          {
            id: result.id.toString(),
            title: result.title,
            start: result.startDate,
            end: result.endDate,
            allDay: result.allDay,
          },
        ]);

        // ดึงข้อมูลใหม่หลังจากสร้าง Task สำเร็จ
        fetchTasks();
      }
    } finally {
      message.success("Event created successfully!");
      setIsModalVisible(false);
      setModalTitle("");
    }
  };

  // ฟังก์ชันจัดการเมื่อคลิกที่เหตุการณ์ในปฏิทิน
  const handleEventClick = (selected: EventClickArg) => {
    setEventToDelete(selected);
    Modal.confirm({
      title: `Are you sure you want to delete the event '${selected.event.title}'?`,
      onOk: async () => {
        try {
          await deleteTask(Number(selected.event.id));
          selected.event.remove();
          message.success("Event deleted successfully!");
          // ดึงข้อมูลใหม่หลังจากลบ Task สำเร็จ
          fetchTasks();
        } catch (error) {
          message.error("Failed to delete the event. Please try again.");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
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
        <Header title="Calendar" subtitle="Full Calendar Interactive Page" />
        <Box display="flex" justifyContent="space-between" sx={{ height: "100%" }}>
          {/* CALENDAR SIDEBAR */}
          <Box
            flex="1 1 20%"
            sx={{
              backgroundColor: colors.primary[400],
              p: "15px",
              borderRadius: "4px",
              height: "100%",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5">Events</Typography>
            <List>
              {currentEvents.map((event: EventInput) => (
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
            <FullCalendar
              height="100%"
              plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,listMonth", // เพิ่มปุ่มสำหรับการแสดงผลในรูปแบบรายการ
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              events={currentEvents}
              datesSet={fetchTasks} // อัปเดตข้อมูลเมื่อเปลี่ยนมุมมอง
              initialEvents={currentEvents}
            />
          </Box>
        </Box>
      </Box>

      {/* Modal สำหรับกรอกชื่อภารกิจ */}
      <Modal
        title="Create a new event"
        visible={isModalVisible}
        onOk={handleCreateTask}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={modalTitle}
          onChange={(e) => setModalTitle(e.target.value)}
          placeholder="Enter event title"
        />
      </Modal>
    </div>
  );
};

export default Calendar;
