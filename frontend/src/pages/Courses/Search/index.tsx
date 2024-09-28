import { useEffect, useState } from "react";
import { Card, Input, message, Space, Empty, Select } from "antd";
import { Star } from "phosphor-react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderComponent from "../../../components/header";
import {
  GetCourses,
  SearchCourseByKeyword,
  GetCourseCategories,
  GetCourseByCategoryID,
  GetReviewById,
  GetCoursesByPriceDESC,
  GetCoursesByPriceASC,
  GetUserByTutorId,
} from "../../../services/https";
import { CourseInterface } from "../../../interfaces/ICourse";
import { CourseCategoryInterface } from "../../../interfaces/ICourse_Category";
import { ReviewInterface } from "../../../interfaces/IReview";
import { UsersInterface } from "../../../interfaces/IUser";

const { Meta } = Card;
const { Search } = Input;

function SearchCourse() {
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [categories, setCategories] = useState<CourseCategoryInterface[]>([]);
  const [reviews, setReviews] = useState<{ [courseID: number]: ReviewInterface[] }>({});
  const [averageRatings, setAverageRatings] = useState<{ [courseID: number]: number }>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryID, setCategoryID] = useState<number | undefined>();
  const setCateID = location.state?.categoryID;

  const [user, setUser] = useState<UsersInterface>();

  const handleCourseClick = (course: CourseInterface) => {
    navigate(`/course/${course.ID}`, { state: { course } });
  };

  const fetchReviews = async (courseID: number) => {
    try {
      const reviewsData = await GetReviewById(courseID);
      setReviews((prevReviews) => ({ ...prevReviews, [courseID]: reviewsData }));

      const ratings = reviewsData.map((review) => review.Rating ?? 0);
      const average = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
      setAverageRatings((prevRatings) => ({ ...prevRatings, [courseID]: parseFloat(average.toFixed(1)) }));
    } catch (error) {
      console.error(`Error fetching reviews for course ${courseID}:`, error);
    }
  };

  useEffect(() => {
    if (courses.length > 0) {
      courses.forEach((course) => {
        fetchReviews(course.ID as number);
      });
    }
  }, [courses]);

  const getCourses = async () => {
    try {
      const course = await GetCourses();
      if (course && Array.isArray(course)) {
        setCourses(course);
      } else {
        throw new Error("No courses found");
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      message.error("ไม่สามารถดึงข้อมูลคอร์สได้");
    }
  };

  const getCategory = async () => {
    try {
      const categories = await GetCourseCategories();
      if (categories) {
        setCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getCoursesByCategory = async (categoryId: number): Promise<CourseInterface[]> => {
    try {
      const coursesByCategory = await GetCourseByCategoryID(categoryId);
      if (Array.isArray(coursesByCategory)) {
        return coursesByCategory;
      } else {
        throw new Error("No courses found for this category");
      }
    } catch {
      throw new Error("Failed to fetch courses by category");
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (setCateID !== undefined && setCateID !== 0) {
        try {
          const courses = await getCoursesByCategory(setCateID);
          setCourses(courses);
        } catch {
          message.error("ไม่สามารถดึงข้อมูลคอร์สตามหมวดหมู่ได้");
        }
      } else {
        await getCourses();
      }
    };

    if (categoryID === undefined) {
      setCategoryID(setCateID);
      fetchCourses();
    }
  }, [setCateID, categoryID]);

  const handleSearch = async (value: string) => {
    try {
      if (value.trim() === "") {
        await getCourses();
      } else {
        const searchResults = await SearchCourseByKeyword(value);
        if (searchResults && Array.isArray(searchResults)) {
          setCourses(searchResults);
        } else {
          message.error("ไม่พบหลักสูตรที่ค้นหา");
        }
      }
    } catch {
      message.error("เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleCategoryChange = async (value: number | undefined) => {
    setCategoryID(value);
    if (value === undefined || value === 0) {
      await getCourses();
    } else {
      try {
        const courses = await getCoursesByCategory(value);
        setCourses(courses);
      } catch {
        message.error("ไม่สามารถดึงข้อมูลคอร์สตามหมวดหมู่ได้");
      }
    }
  };

  const handleSortChange = async (value: number | undefined) => {
    if (value === undefined || value === 0) {
      await getCourses();
    } else if (value === 1) {
      try {
        const courses = await GetCoursesByPriceDESC();
        setCourses(courses);
      } catch {
        message.error("ไม่สามารถดึงข้อมูลคอร์สตามหมวดหมู่ได้");
      }
    } else if (value === 2) {
      try {
        const courses = await GetCoursesByPriceASC();
        setCourses(courses);
      } catch {
        message.error("ไม่สามารถดึงข้อมูลคอร์สตามหมวดหมู่ได้");
      }
    }
  };

  const getUser = async (tutorProfileID: string) => {
    try {
        const UserData = await GetUserByTutorId(tutorProfileID);
        setUser(UserData.data);
    } catch (error) {
        console.error(`Unknown User`, error);
    }
  };
  

  useEffect(() => {
    if (courses.length > 0 && !user) {
        const tutorProfileID = courses[0].TutorProfileID;
        
        if (tutorProfileID !== undefined) {
            getUser(tutorProfileID.toString());
        }
    }
  }, [courses, user]);

  return (
    <>
      <HeaderComponent />
      <section style={{ padding: "100px 50px 30px 50px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Select
              defaultValue={setCateID || 0}
              placeholder="เลือกหมวดหมู่"
              onChange={handleCategoryChange}
              style={{ width: '20%', marginBottom: '10px' }}
            >
              <Select.Option value={0}>คอร์สทั้งหมด</Select.Option>
              {categories.map((category) => (
                <Select.Option key={category.ID} value={category.ID}>
                  {category.CategoryName}
                </Select.Option>
              ))}
            </Select>
            <Search
              placeholder="ค้นหาหลักสูตร"
              onSearch={handleSearch}
              style={{
                width: "50%",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                marginBottom: "10px",
              }}
            />
            <Select
              defaultValue={0}
              placeholder="เรียงลำดับตามราคา"
              onChange={handleSortChange}
              style={{ width: '20%', marginBottom: '10px' }}
            >
              <Select.Option value={0}>เรียงลำดับตามราคา</Select.Option>
              <Select.Option value={1}>มากไปน้อย</Select.Option>
              <Select.Option value={2}>น้อยไปมาก</Select.Option>
            </Select>
          </div>
          {courses.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {courses.map((course: CourseInterface) => (
                <div key={course.ID} onClick={() => handleCourseClick(course)}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={course.Title}
                        src={course.ProfilePicture || "https://via.placeholder.com/200x200"}
                        style={{
                          borderRadius: "20px",
                          height: "200px",
                          objectFit: "cover",
                          width: "100%",
                          padding: "10px",
                          overflow: "hidden",
                        }}
                      />
                    }
                    style={{
                      borderRadius: "15px",
                      overflow: "hidden",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                    }}
                  >
                    <Meta title={course.Title} description={`Tutor: ${user?.Username ?? "ไม่ระบุ"}`} />
                    <div
                      style={{
                        marginTop: "5px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        gap: "5px",
                      }}
                    >
                      <Star
                        size={15}
                        weight="fill"
                        style={{ color: "#ffcc00", marginLeft: "5px" }}
                      />
                      {course.ID !== undefined && reviews[course.ID]?.length > 0
                        ? `Rating: ${averageRatings[course.ID] || 0} (${reviews[course.ID].length.toLocaleString()})`
                        : "Rating: 0 (0)"
                      }
                    </div>
                    <div
                      style={{
                        marginTop: "5px",
                        fontWeight: "bold",
                        color: "#ff4500",
                        fontSize: "14px",
                      }}
                    >
                      <span className="currency">฿</span>
                      {Number(course.Price?.toFixed(2)).toLocaleString(undefined, 
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="ไม่พบคอร์สที่ค้นหา" />
          )}
        </Space>
      </section>
    </>
  );
}

export default SearchCourse;
