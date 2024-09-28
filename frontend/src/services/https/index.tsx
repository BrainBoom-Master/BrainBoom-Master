import { SignInInterface } from "../../interfaces/SignIn";
import { UsersInterface } from "../../interfaces/IUser";
import axios from "axios";
import { CourseInterface } from "../../interfaces/ICourse";
import { ReviewInterface } from "../../interfaces/IReview";
import { PaymentsInterface } from "../../interfaces/IPayment";
import { Tutor as TutorInterface } from "../../interfaces/Tutor";
import { CreditCardInterface } from "../../interfaces/ICreditCard";
import { PromptPayInterface } from "../../interfaces/IPromptpay";
import { Task } from "../../interfaces/task";

const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,
  },
};

// Eye
// ฟังก์ชันสำหรับการสร้าง Authorization Header
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // ดึง token จาก localStorage
  const tokenType = localStorage.getItem("token_type") || "Bearer"; // ตรวจสอบว่ามี token_type หรือไม่ หากไม่มีให้ใช้ Bearer เป็นค่า default
  return token ? `${tokenType} ${token}` : null;
};

// ฟังก์ชันสำหรับการล็อกอิน
async function SignIn(data: SignInInterface) {
  return await axios
    .post(`${apiUrl}/signin`, data)
    .then(async (res) => {
      // เมื่อผู้ใช้ล็อกอินสำเร็จ เก็บ token ใน localStorage
      const token = res.data.token;
      const tokenType = res.data.token_type || "Bearer";
      localStorage.setItem("token", token);
      localStorage.setItem("token_type", tokenType);

      // ดึง user ID จาก response
      //const userId = res.data.userId; // สมมุติว่า response มี userId

      // บันทึก login history
      //await AddLoginHistory(userId);

      return res;
    })
    .catch((e) => e.response);
}

// ฟังก์ชันสำหรับการจัดการผู้ใช้

// ดึงข้อมูลผู้ใช้ทั้งหมด
async function GetUsers() {
  return await axios
    .get(`${apiUrl}/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงข้อมูลผู้ใช้ตาม ID
async function GetUserById(id: string) {
  return await axios
    .get(`${apiUrl}/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUserByTutorId(id: string) {
  return await axios
    .get(`${apiUrl}/users/tutor/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

// อัปเดตข้อมูลผู้ใช้ตาม ID
async function UpdateUserById(id: string, data: UsersInterface) {
  return await axios
    .put(`${apiUrl}/users/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

// ลบผู้ใช้ตาม ID
async function DeleteUserById(id: string) {
  return await axios
    .delete(`${apiUrl}/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

// สร้างผู้ใช้ใหม่
async function CreateUser(data: UsersInterface) {
  return await axios
    .post(`${apiUrl}/signup`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

// อัปเดตพาสเวิร์ด
async function UpdatePasswordById(
  id: string,
  data: { old_password: string; new_password: string; confirm_password: string }
) {
  return await axios
    .put(`${apiUrl}/users/password/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetTutors() {
  return await axios
    .get(`${apiUrl}/tutor_profiles`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetTutorProfileByUserId(UserID: string) {
  return await axios
    .get(`${apiUrl}/tutor_profiles/${UserID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

// อัปเดตข้อมูลตาม ID
async function UpdateTutorById(UserID: string, data: TutorInterface) {
  return await axios
    .put(`${apiUrl}/tutor_profiles/${UserID}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user_role_id: number;
}

const loginService = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post("/api/login", data);
  return response.data;
};

//History

async function GetLoginHistory(userId: number) {
  return await axios
    .get(`${apiUrl}/loginhistory/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
    })
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function AddLoginHistory(userId: number) {
  const data = {
    userId,
    LoginTimeStamp: new Date().toISOString(),
  };

  return await axios
    .post(`${apiUrl}/loginhistory`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
    })
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function GetLoginHistoryByUserId(UserID: string) {
  try {
    const response = await axios.get(`${apiUrl}/loginhistory/users/${UserID}`); // แก้ไขเส้นทางให้ตรงกับ backend
    return response.data; // ส่งคืนเฉพาะข้อมูลที่อยู่ใน response.data
  } catch (error) {
    console.error("Error fetching login history:", error);
    throw error;
  }
}

//Pond
async function GetCourses() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/courses`, requestOptions).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error("Response is not in JSON format");
    }
  });

  return res;
}

async function GetCoursesByPriceASC() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/courses/price/asc`, requestOptions).then(
    (res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("Response is not in JSON format");
      }
    }
  );

  return res;
}

async function GetCoursesByPriceDESC() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/courses/price/desc`, requestOptions).then(
    (res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("Response is not in JSON format");
      }
    }
  );

  return res;
}

async function GetCourseCategories() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/categories`, requestOptions).then(
    (res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("Response is not in JSON format");
      }
    }
  );

  return res;
}

async function CreateCourse(data: CourseInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/courses`, requestOptions);
    console.log(data);

    if (res.ok) {
      return await res.json();
    } else {
      const errorData = await res.json();
      console.error("Error creating course:", errorData);
      return { success: false, message: errorData.error || "Unknown error" };
    }
  } catch (error) {
    console.error("Network error:", error);
    return { success: false, message: "Network error occurred" };
  }
}

async function UpdateCourse(id: number, data: CourseInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/courses/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } else {
      const errorData = await res.json();
      console.error("Error updating course:", errorData);
      return false; // หรือคุณสามารถส่งคืนข้อความผิดพลาดที่ชัดเจนขึ้นได้
    }
  } catch (error) {
    console.error("Network error:", error);
    return false;
  }
}

async function GetCourseById(id: number) {
  const requestOptions = {
    method: "GET",
  };

  const res = await fetch(`${apiUrl}/courses/${id}`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

async function GetCourseByCategoryID(id: number): Promise<CourseInterface[]> {
  const requestOptions = {
    method: "GET",
  };

  try {
    const res = await fetch(`${apiUrl}/courses/category/${id}`, requestOptions);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

async function GetCourseByTutorID(tutorID: number) {
  try {
    const response = await fetch(`${apiUrl}/tutor/${tutorID}`);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error("Received data is not an array");
      }
    } else {
      throw new Error("Response is not JSON");
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

// ดึงข้อมูลโปรไฟล์ของ tutor ตาม ID
async function GetTutorProfileById(UserID: number) {
  return await axios
    .get(`${apiUrl}/tutor_profiles/${UserID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

async function SearchCourseByKeyword(keyword: string) {
  try {
    const query = new URLSearchParams();
    query.append("keyword", keyword);

    const response = await fetch(
      `${apiUrl}/courses/search?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) return [];
    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาคอร์สตามคำสำคัญ:", error);
    return false;
  }
}

async function DeleteCourseByID(id: number | undefined) {
  const requestOptions = {
    method: "DELETE",
  };

  const res = await fetch(
    `${apiUrl}/courses/delete/${id}`,
    requestOptions
  ).then((res) => {
    if (res.status == 200) {
      return true;
    } else {
      return false;
    }
  });

  return res;
}

// Reviews By Tawun
const GetUserByIdReview = async (
  id: number | undefined
): Promise<UsersInterface | false> => {
  try {
    if (id === undefined) return false;

    const response = await fetch(`${apiUrl}/user/${id}`, {
      method: "GET",
    });

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูลผู้ใช้ตาม ID:", error);
    return false;
  }
};

// สร้างรีวิว
const CreateReview = async (
  data: ReviewInterface
): Promise<ReviewInterface | false> => {
  try {
    const response = await fetch(`${apiUrl}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.status !== 201)
      throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการสร้างรีวิว:", error);
    return false;
  }
};

async function GetReviewsByID(id: number) {
  // edit

  return await axios

    .get(`${apiUrl}/review/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

//update
const UpdateReview = async (
  id: number,
  data: ReviewInterface
): Promise<ReviewInterface | false> => {
  try {
    const response = await fetch(`${apiUrl}/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.status !== 200)
      throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการอัปเดตรีวิว:", error);
    return false;
  }
};

// รายการรีวิวทั้งหมด
const ListReview = async (): Promise<ReviewInterface[] | false> => {
  try {
    const response = await fetch(`${apiUrl}/reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูลรีวิว:", error);
    return false;
  }
};

// ดึงรีวิวตาม ID
const GetReviewById = async (id: number): Promise<ReviewInterface[]> => {
  try {
    const response = await fetch(`${apiUrl}/reviews/course/${id}`, {
      method: "GET",
    });

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    const data = await response.json();
    return Array.isArray(data) ? data : []; // ตรวจสอบให้แน่ใจว่าคืนค่าเป็นอาร์เรย์
  } catch {
    return [];
  }
};

// ดึงรีวิวที่กรองตามเงื่อนไข
const GetFilteredReviews = async (
  starLevel: string,
  courseID?: number
): Promise<ReviewInterface[] | false> => {
  try {
    const query = new URLSearchParams();
    query.append("starLevel", starLevel);
    if (courseID !== undefined) {
      query.append("courseID", courseID.toString());
    }

    const response = await fetch(
      `${apiUrl}/reviews/filter?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) return [];
    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch {
    return false;
  }
};

// ค้นหารีวิวตามคำสำคัญ
const SearchReviewsByKeyword = async (
  keyword: string,
  courseID: number
): Promise<ReviewInterface[] | false> => {
  try {
    const query = new URLSearchParams();
    query.append("keyword", keyword);
    query.append("courseID", courseID.toString());

    const response = await fetch(
      `${apiUrl}/reviews/search?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) return [];
    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหารีวิวตามคำสำคัญ:", error);
    return false;
  }
};

// ดึงค่าเฉลี่ยของคะแนนรีวิวตาม ID ของหลักสูตร
const GetRatingsAvgByCourseID = async (
  courseID: number
): Promise<{ rating: number; percentage: number }[] | false> => {
  try {
    const response = await fetch(`${apiUrl}/course/${courseID}/ratings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    const data = await response.json();

    if (!Array.isArray(data.ratings)) return false;

    const ratings: number[] = data.ratings;
    const ratingCount = ratings.length;

    const ratingSummary = ratings.reduce<{ [key: number]: number }>(
      (acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      },
      {}
    );

    const avgRatings = Object.keys(ratingSummary).map((rating) => ({
      rating: Number(rating),
      percentage: (ratingSummary[Number(rating)] / ratingCount) * 100,
    }));

    return avgRatings;
  } catch (error) {
    console.error(
      "ข้อผิดพลาดในการดึงค่าเฉลี่ยคะแนนรีวิวตาม ID ของหลักสูตร:",
      error
    );
    return false;
  }
};

// ดึงรีวิวตาม ID ของหลักสูตร
const getReviewsByCourseID = async (
  courseID: number
): Promise<ReviewInterface[] | false> => {
  try {
    const response = await fetch(`/api/reviews/course/${courseID}`);
    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงรีวิวตาม ID ของหลักสูตร:", error);
    return false;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลสถานะไลค์
const fetchLikeStatus = async (
  reviewID: number,
  userID: number
): Promise<{ hasLiked: boolean; likeCount: number } | false> => {
  try {
    const response = await fetch(
      `${apiUrl}/reviews/${userID}/${reviewID}/like`
    );
    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    const data = await response.json();
    return {
      hasLiked: data.hasLiked ?? false,
      likeCount: data.likeCount ?? 0,
    };
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงสถานะไลค์:", error);
    return false;
  }
};

// ฟังก์ชันสำหรับกดไลค์
const onLikeButtonClick = async (
  reviewID: number,
  userID: number
): Promise<any | false> => {
  try {
    const response = await fetch(`${apiUrl}/reviews/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userID, review_id: reviewID }),
    });

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการกดไลค์:", error);
    return false;
  }
};

// ฟังก์ชันสำหรับยกเลิกไลค์
const onUnlikeButtonClick = async (reviewID: number, userID: number) => {
  try {
    const response = await fetch(`${apiUrl}/reviews/unlike`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userID, review_id: reviewID }),
    });

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการยกเลิกไลค์:", error);
    return false;
  }
};

// ของ ปาย
async function GetTotalCourse() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/course-count`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

async function GetTotalTutor() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/tutor-count`, requestOptions) // เปลี่ยนเป็น endpoint สำหรับนับ Tutor
    .then((res) => {
      if (res.status === 200) {
        return res.json(); // คืนค่าข้อมูล JSON ถ้าสถานะเป็น 200
      } else {
        return false; // คืนค่า false ถ้าเกิดข้อผิดพลาด
      }
    });

  return res; // คืนค่าผลลัพธ์ที่ได้
}
async function GetTotalStudent() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/student-count`, requestOptions) // เปลี่ยนเป็น endpoint สำหรับนับ Tutor
    .then((res) => {
      if (res.status === 200) {
        return res.json(); // คืนค่าข้อมูล JSON ถ้าสถานะเป็น 200
      } else {
        return false; // คืนค่า false ถ้าเกิดข้อผิดพลาด
      }
    });

  return res; // คืนค่าผลลัพธ์ที่ได้
}
async function GetTotalPaid() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/total-paid`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}
async function GetRecentTransactions() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/recent-paid`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

async function GetDataGraph() {
  const requestOptions = {
    method: "GET",
  };

  const res = await fetch(`${apiUrl}/courses-graph`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

//--Update--
async function CreateUserByAdmin(userData: UsersInterface) {
  try {
    const response = await axios.post(`${apiUrl}/signup`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ใส่ Header หากมี token
      },
    });

    return { success: true, data: response.data }; // ส่งผลลัพธ์กลับ
  } catch (error) {
    console.error("Error creating user:", error);

    // แสดงข้อมูลข้อผิดพลาดเพิ่มเติม
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
      return {
        success: false,
        message:
          error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างผู้ใช้",
      };
    } else {
      return {
        success: false,
        message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
      }; // ข้อความทั่วไป
    }
  }
}

//--ปาย เพิ่มมาใหม่
async function GetTask() {
  return await axios
    .get(`${apiUrl}/tasks`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
}

// เพิ่มมาใหม่

const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  try {
    const response = await axios.post<Task>(`${apiUrl}/create-tasks`, task);
    return response.data;
  } catch (error) {
    throw new Error("Error creating task: " + error);
  }
};

const deleteTask = async (taskId: number): Promise<void> => {
  try {
    const response = await axios.delete<void>(
      `${apiUrl}/delete-tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error deleting task: " + error);
  }
};

// Payment By Max ตะวันใช้ดึงข้อมูล user มารีวิว in MyCourse
async function GetPaymentByIdUser(userID: number): Promise<any> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(
      `${apiUrl}/payments/user/${userID}`,
      requestOptions
    );

    if (res.status === 200) {
      const payments = await res.json();
      return payments;
    } else if (res.status === 404) {
      console.error("ไม่พบการชำระเงินสำหรับผู้ใช้ที่ระบุ");
      return null;
    } else {
      console.error("เกิดข้อผิดพลาด:", res.statusText);
      return false;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเรียก API:", error);
    return false;
  }
}

async function GetPaymentByIdCourse(
  courseID: number
): Promise<PaymentsInterface[] | null | false> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(
      `${apiUrl}/payments/courses/${courseID}`,
      requestOptions
    );
    if (res.status === 200) {
      const payments = await res.json();

      if (Array.isArray(payments)) {
        return payments as PaymentsInterface[];
      } else {
        return false;
      }
    } else if (res.status === 404) {
      return null;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

async function GetPayments() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/payments`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function CreatePayment(data: PaymentsInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/payment`, requestOptions).then((res) => {
    if (res.status == 201) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function CreateCreditCard(data: CreditCardInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/credit-card`, requestOptions).then(
    (res) => {
      if (res) {
        return res.json();
      } else {
        return null;
      }
    }
  );

  return res;
}

async function CreatePromptPay(data: PromptPayInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/prompt-pay`, requestOptions).then(
    (res) => {
      if (res) {
        return res.json();
      } else {
        return null;
      }
    }
  );

  return res;
}

async function GetPaymentByIdCourseAndIdUser(
  courseID: number,
  userID: number
): Promise<PaymentsInterface[] | null | false> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(
      `${apiUrl}/payments/courses/${courseID}/${userID}`,
      requestOptions
    );
    if (res.status === 200) {
      const payments = await res.json();

      if (Array.isArray(payments)) {
        return payments as PaymentsInterface[];
      } else {
        return false;
      }
    } else if (res.status === 404) {
      return null;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

// Export ฟังก์ชันทั้งหมด
export {
  //User eye
  SignIn,
  GetUsers,
  GetUserById,
  GetUserByTutorId,
  UpdateUserById,
  DeleteUserById,
  CreateUser,
  UpdatePasswordById,
  loginService,
  GetTutorProfileByUserId,
  GetTutors,
  UpdateTutorById,
  GetLoginHistory,
  AddLoginHistory,
  GetTutorProfileById,
  GetRecentTransactions,
  GetLoginHistoryByUserId,
  //Tawun
  GetReviewsByID,
  GetUserByIdReview,
  CreateReview,
  UpdateReview,
  ListReview,
  GetReviewById,
  GetFilteredReviews,
  SearchReviewsByKeyword,
  GetRatingsAvgByCourseID,
  getReviewsByCourseID,
  fetchLikeStatus,
  onLikeButtonClick,
  //Course Pond
  GetCourses,
  GetCoursesByPriceASC,
  GetCoursesByPriceDESC,
  GetCourseCategories,
  CreateCourse,
  UpdateCourse,
  GetCourseById,
  GetCourseByCategoryID,
  GetCourseByTutorID,
  SearchCourseByKeyword,
  DeleteCourseByID,
  onUnlikeButtonClick,
  //Admin Pai
  GetTotalCourse,
  GetTotalTutor,
  GetTotalStudent,
  GetTotalPaid,
  GetDataGraph,
  CreateUserByAdmin,
  GetTask,
  createTask,
  deleteTask,
  //Payment Mac
  GetPaymentByIdUser, // ตะวันใช้ get ข้อมูลลง mycourse
  GetPayments,
  CreatePayment,
  CreateCreditCard,
  CreatePromptPay,
  GetPaymentByIdCourseAndIdUser,
  GetPaymentByIdCourse,
};
