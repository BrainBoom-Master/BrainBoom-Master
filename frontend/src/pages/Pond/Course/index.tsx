import { useEffect, useState } from "react";
import { Card, Button } from "antd";
import { Star } from "phosphor-react";
import { Link, useNavigate} from "react-router-dom";
import HeaderComponent from '../../../components/header';
import { GetCourses } from "../../../services/https";
import { CourseInterface } from "../../../interfaces/ICourse";

const { Meta } = Card;

function Course() {
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCourseClick = (course: CourseInterface) => {
    navigate(`/course/${course.ID}`, { state: { course } });
  };

  const getCourses = async () => {
    try {
      const course = await GetCourses();
      console.log("Courses fetched:", course);
      if (course) {
        setCourses(course);
      } else {
        setError("No courses found");
      }

    } catch (error) {
      if (error instanceof Error) {
        setError("Failed to fetch courses: " + error.message);
      } else {
        setError("Failed to fetch courses");
      }
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const categories = [
    { id: 1, title: "คอร์สทั้งหมด" },
    { id: 2, title: "ยอดนิยม" },
    { id: 3, title: "แนะนำสำหรับคุณ" },
  ];

  return (
    <>
      <HeaderComponent />
      <section style={{ padding: "95px 50px 30px 50px" }}>
        {categories.map((category) => (
          <div key={category.id} style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "30px",
                color: "#002A48",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              {category.title}
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                overflowX: "auto",
                gap: "15px",
                paddingBottom: "15px",
              }}
            >
              {courses.slice(0, 7).map((course: CourseInterface) => (
                
                <div key={course.ID} onClick={() => handleCourseClick(course)}>
                  <Card
                    key={`course-card-${course.ID}`}
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
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            style={{
                              color: "rgb(99, 94, 94)",
                            }}
                          >
                            {course.ID !== undefined &&
                            reviews[course.ID]?.length > 0
                              ? `Rating: ${
                                  averageRatings[course.ID] || 0
                                } (${reviews[
                                  course.ID
                                ].length.toLocaleString()})`
                              : "Rating: 0 (0)"}
                          </span>
                        </div>
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
                        {Number(course.Price)?.toFixed(2).toLocaleString()}
                      </div>
                    </Card>
                  </div>
                ))
              ) : (
                <Empty description="ไม่พบคอร์สที่ค้นหา" />
              )}
              <div
                key={`more-btn-${category.id}`} 
                style={{
                  flex: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100px",
                }}
              >
                <Link to={`/course/category/${category.id}`} style={{ textDecoration: "none" }}>
                  <Button
                    type="link"
                    style={{
                      display: "block",
                      textAlign: "center",
                      color: "#002A48",
                      margin: "10px 0",
                    }}
                  >
                    ดูเพิ่มเติม
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default Course;
