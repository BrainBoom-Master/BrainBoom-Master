import { useEffect, useState } from "react";
import { Card, Input, message, Space, Empty, Select } from "antd";
import { Star } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../../../components/header";
import { GetCourses, SearchCourseByKeyword, GetCourseCategories, GetCourseByCategoryID } from "../../../services/https";
import { CourseInterface } from "../../../interfaces/ICourse";
import { CourseCategoryInterface } from "../../../interfaces/ICourse_Category"

const { Meta } = Card;
const { Search } = Input;

function SearchCourse() {
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [categories, setCategories] = useState<CourseCategoryInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const [categoryID, setCategoryID] = useState<number>();

  const handleCourseClick = (course: CourseInterface) => {
    navigate(`/course/${course.ID}`, { state: { course } });
  };

  const getCourses = async () => {
    try {
      const course = await GetCourses();
      if (course) {
        setCourses(course);
      } else {
        setError("No courses found");
      }
    } catch {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const GetCategory = async () => {
    try {
      const categories = await GetCourseCategories();
      if (categories) {
        setCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCoursesByCategory = async (categoryId: number) => {
    try {
      const coursesByCategory = await GetCourseByCategoryID(categoryId);
      if (coursesByCategory) {
        setCourses(coursesByCategory);
      }
    } catch {
      setError("Failed to fetch courses by category");
    }
  };

  useEffect(() => {
    getCourses();
    GetCategory();
  }, []);

  useEffect(() => {
    if (categoryID === undefined) {
      getCourses();
    } else {
      getCoursesByCategory(categoryID);
    }
  }, [categoryID]);
  

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
    if (value === undefined) {
      const course = await GetCourses();
      setCourses(course);
    } else {
      const course = await GetCourseByCategoryID(value);
      setCourses(course);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <HeaderComponent />
      <section style={{ padding: "100px 50px 30px 50px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div 
            style = {{
              display: "flex",
              flexDirection:"row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Select
              placeholder="เลือกหมวดหมู่"
              onChange={handleCategoryChange}
              style={{ width: '25%', marginBottom: '10px' }}
            >
              <Select.Option value={undefined}>เลือกหมวดหมู่</Select.Option>
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
                        src={
                          course.ProfilePicture ||
                          "https://via.placeholder.com/200x200"
                        }
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
                    styles={{body:{ padding: "10px" }}}
                  >
                    <Meta
                      title={course.Title}
                      description={`Tutor: ${course.TutorProfileID}`}
                      style={{ fontSize: "12px" }}
                    />
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
                      5.0
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
                      {course.Price?.toFixed(2)}
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
