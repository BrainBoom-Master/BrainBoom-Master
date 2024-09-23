import { SignInInterface } from "../../interfaces/SignIn";
import { UsersInterface } from "../../interfaces/IUser";
import axios from "axios";
import { CourseInterface } from "../../interfaces/ICourse";
import { ReviewInterface } from "../../interfaces/IReview";
import { PaymentsInterface } from "../../interfaces/IPayment";

const apiUrl = "http://localhost:8000";

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
    .then((res) => {
      // เมื่อผู้ใช้ล็อกอินสำเร็จ เก็บ token ใน localStorage
      const token = res.data.token;
      const tokenType = res.data.token_type || "Bearer";
      localStorage.setItem("token", token);
      localStorage.setItem("token_type", tokenType);
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
  payload: { current_password: string; new_password: string }
) {
  return await axios
    .put(`${apiUrl}/users/${id}/update-password`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(), // ส่ง Authorization Header ในคำขอ
      },
    })
    .then((res) => res)
    .catch((e) => e.response);
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

async function GetCourseCategories() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/categories`, requestOptions).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error("Response is not in JSON format");
    }
  });

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
      console.error('Error creating course:', errorData);
      return { success: false, message: errorData.error || 'Unknown error' }; 
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, message: 'Network error occurred' };
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
      console.error('Error updating course:', errorData);
      return false; // หรือคุณสามารถส่งคืนข้อความผิดพลาดที่ชัดเจนขึ้นได้
    }
  } catch (error) {
    console.error('Network error:', error);
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

async function GetCourseByCategoryID(categoryID: number) {
  try {
    const response = await fetch(`/courses/category/${categoryID}`);
    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("การตอบสนองไม่ใช่ JSON");
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูลคอร์ส:", error);
    return false;
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

async function SearchCourseByKeyword(keyword: string){
  try {
      const query = new URLSearchParams();
      query.append("keyword", keyword);

      const response = await fetch(`${apiUrl}/courses/search?${query.toString()}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (response.status === 204) return [];
      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      return await response.json();
  } catch (error) {
      console.error('ข้อผิดพลาดในการค้นหาคอร์สตามคำสำคัญ:', error);
      return false;
  }
};



async function DeleteCourseByID(id: number | undefined) {
  const requestOptions = {
    method: "DELETE"
  };

  const res = await fetch(`${apiUrl}/courses/delete/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}

// Reviews By Tawun
export const GetUserByIdReview = async (id: number | undefined): Promise<UsersInterface | false> => {
  try {
      if (id === undefined) return false;

      const response = await fetch(`${apiUrl}/user/${id}`, {
          method: "GET"
      });

      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      return await response.json();
  } catch (error) {
      console.error('ข้อผิดพลาดในการดึงข้อมูลผู้ใช้ตาม ID:', error);
      return false;
  }
};

// สร้างรีวิว
export const CreateReview = async (data: ReviewInterface): Promise<ReviewInterface | false> => {
  try {
      const response = await fetch(`${apiUrl}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
      });

      if (response.status !== 201) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      return await response.json();
  } catch (error) {
      console.error('ข้อผิดพลาดในการสร้างรีวิว:', error);
      return false;
  }
};

// รายการรีวิวทั้งหมด
export const ListReview = async (): Promise<ReviewInterface[] | false> => {
  try {
      const response = await fetch(`${apiUrl}/reviews`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      return await response.json();
  } catch (error) {
      console.error('ข้อผิดพลาดในการดึงข้อมูลรีวิว:', error);
      return false;
  }
};

// ดึงรีวิวตาม ID
export const GetReviewById = async (id: number): Promise<ReviewInterface[]> => {
  try {
      const response = await fetch(`${apiUrl}/reviews/course/${id}`, {
          method: "GET"
      });

      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      const data = await response.json();
      return Array.isArray(data) ? data : []; // ตรวจสอบให้แน่ใจว่าคืนค่าเป็นอาร์เรย์
  } catch (error) {
      console.error('ข้อผิดพลาดในการดึงรีวิวตาม ID:', error);
      return [];
  }
};

// ดึงรีวิวที่กรองตามเงื่อนไข
export const GetFilteredReviews = async (starLevel: string, courseID?: number): Promise<ReviewInterface[] | false> => {
  try {
      const query = new URLSearchParams();
      query.append("starLevel", starLevel);
      if (courseID !== undefined) {
          query.append("courseID", courseID.toString());
      }

      const response = await fetch(`${apiUrl}/reviews/filter?${query.toString()}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (response.status === 204) return [];
      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      return await response.json();
  } catch (error) {
      console.error('ข้อผิดพลาดในการดึงรีวิวที่กรอง:', error);
      return false;
  }
};

// ค้นหารีวิวตามคำสำคัญ
export const SearchReviewsByKeyword = async (keyword: string, courseID: number): Promise<ReviewInterface[] | false> => {
  try {
      const query = new URLSearchParams();
      query.append("keyword", keyword);
      query.append("courseID", courseID.toString());

      const response = await fetch(`${apiUrl}/reviews/search?${query.toString()}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (response.status === 204) return [];
      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      return await response.json();
  } catch (error) {
      console.error('ข้อผิดพลาดในการค้นหารีวิวตามคำสำคัญ:', error);
      return false;
  }
};

// ดึงค่าเฉลี่ยของคะแนนรีวิวตาม ID ของหลักสูตร
export const GetRatingsAvgByCourseID = async (courseID: number): Promise<{ rating: number; percentage: number }[] | false> => {
  try {
      const response = await fetch(`${apiUrl}/course/${courseID}/ratings`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      const data = await response.json();

      if (!Array.isArray(data.ratings)) return false;

      const ratings: number[] = data.ratings;
      const ratingCount = ratings.length;

      const ratingSummary = ratings.reduce<{ [key: number]: number }>((acc, rating) => {
          acc[rating] = (acc[rating] || 0) + 1;
          return acc;
      }, {});

      const avgRatings = Object.keys(ratingSummary).map(rating => ({
          rating: Number(rating),
          percentage: (ratingSummary[Number(rating)] / ratingCount) * 100
      }));

      return avgRatings;
  } catch (error) {
      console.error('ข้อผิดพลาดในการดึงค่าเฉลี่ยคะแนนรีวิวตาม ID ของหลักสูตร:', error);
      return false;
  }
};

// ดึงรีวิวตาม ID ของหลักสูตร
export const getReviewsByCourseID = async (courseID: number): Promise<ReviewInterface[] | false> => {
  try {
      const response = await fetch(`/api/reviews/course/${courseID}`);
      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      return await response.json();
  } catch (error) {
      console.error('ข้อผิดพลาดในการดึงรีวิวตาม ID ของหลักสูตร:', error);
      return false;
  }
};


// ฟังก์ชันสำหรับดึงข้อมูลสถานะไลค์
export const fetchLikeStatus = async (reviewID: number, userID: number): Promise<{ hasLiked: boolean; likeCount: number } | false> => {
  try {
      const response = await fetch(`${apiUrl}/reviews/${userID}/${reviewID}/like`);
      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      const data = await response.json();
      return {
          hasLiked: data.hasLiked ?? false,
          likeCount: data.likeCount ?? 0
      };
  } catch (error) {
      console.error('ข้อผิดพลาดในการดึงสถานะไลค์:', error);
      return false;
  }
};

// ฟังก์ชันสำหรับกดไลค์
export const onLikeButtonClick = async (reviewID: number, userID: number): Promise<any | false> => {
  try {
      const response = await fetch(`${apiUrl}/reviews/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userID, review_id: reviewID }),
      });

      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      return await response.json();
  } catch (error) {
      console.error('ข้อผิดพลาดในการกดไลค์:', error);
      return false;
  }
};

// ฟังก์ชันสำหรับยกเลิกไลค์
export const onUnlikeButtonClick = async (reviewID: number, userID: number) => {
  try {
      const response = await fetch(`${apiUrl}/reviews/unlike`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userID, review_id: reviewID }),
      });

      if (!response.ok) throw new Error('การตอบสนองของเครือข่ายไม่ถูกต้อง');
      return await response.json();
  } catch (error) {
      console.error('ข้อผิดพลาดในการยกเลิกไลค์:', error);
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

  const res = await fetch(`${apiUrl}/course-count`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// Payment By Max ตะวันใช้ดึงข้อมูล user มารีวิว in MyCourse
async function GetPaymentByIdUser(userID: number): Promise<any> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(`${apiUrl}/payments/user/${userID}`, requestOptions);

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

async function GetPriceById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  const res = await fetch(`${apiUrl}/course-price/${id}`, requestOptions).then(
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

async function GetTitleById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  const res = await fetch(`${apiUrl}/course-title/${id}`, requestOptions).then(
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


// Export ฟังก์ชันทั้งหมด
export {
  //User eye
  SignIn,
  GetUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
  CreateUser,
  UpdatePasswordById,
  loginService,
  GetTutorProfileById,
  //Course Pond
  GetCourses,
  GetCourseCategories,
  CreateCourse,
  UpdateCourse,
  GetCourseById,
  GetCourseByCategoryID,
  GetCourseByTutorID,
  SearchCourseByKeyword,
  DeleteCourseByID,
  //Admin Pai
  GetTotalCourse,
  //Payment Mac
  GetPaymentByIdUser, // ตะวันใช้ get ข้อมูลลง mycourse
  GetPayments,
  GetPriceById,
  GetTitleById,
  CreatePayment,
};
