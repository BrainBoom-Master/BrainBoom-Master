import { useEffect, useState } from "react";
import { Card, Button, Empty } from "antd";
import { Star } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../../../components/header";
import { GetCourseCategories, GetCourses, GetReviewById, GetUserByTutorId } from "../../../services/https";
import { CourseInterface } from "../../../interfaces/ICourse";
import { ReviewInterface } from "../../../interfaces/IReview";
import { CourseCategoryInterface } from "../../../interfaces/ICourse_Category";
import { UsersInterface } from "../../../interfaces/IUser";

const { Meta } = Card;

function Course() {
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [categories, setCategories] = useState<CourseCategoryInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<{ [courseID: number]: ReviewInterface[] }>({});
  const [averageRatings, setAverageRatings] = useState<{ [courseID: number]: number }>({});
  const [error] = useState<string | null>(null);
  const [user, setUser] = useState<UsersInterface>();

  const navigate = useNavigate();

  const handleCourseClick = (course: CourseInterface) => {
    navigate(`/course/${course.ID}`, { state: { course } });
  };

  const handleAllCourseClick = (categoryID: number) => {
    navigate(`/search`, { state: { categoryID } });
  };

  const getCourses = async () => {
    try {
      const courseData = await GetCourses();
      if (courseData) {
        setCourses(courseData);
      } else {
        console.log("No courses found");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (courseID: number) => {
    try {
      const reviewsData = await GetReviewById(courseID);
      setReviews((prevReviews) => ({ ...prevReviews, [courseID]: reviewsData }));

      const ratings = reviewsData.map((review) => review.Rating ?? 0);
      const average = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;
      setAverageRatings((prevRatings) => ({ 
        ...prevRatings, 
        [courseID]: parseFloat(average.toFixed(1)) 
      }));
    } catch (error) {
      console.error(`Error fetching reviews for course ${courseID}:`, error);
    }
  };

  const getCategories = async () => {
    try {
      const categories = await GetCourseCategories();
      if (categories) {
        setCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  useEffect(() => {
    getCourses();
    getCategories();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      courses.forEach((course) => {
        fetchReviews(course.ID as number);
      });
    }
  }, [courses]);

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


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <HeaderComponent />
      <section style={{ padding: "95px 50px 30px 50px" }}>
        <h2 style={{ 
          fontSize: "30px", 
          color: "#002A48", 
          fontWeight: "bold", 
          marginBottom: "20px" 
        }}>
          คอร์สทั้งหมด
        </h2>
        <div style={{ 
          display: "flex", 
          flexDirection: "row", 
          overflowX: "auto", 
          gap: "15px", 
          paddingBottom: "15px", 
        }}>

          {courses.length > 0 ? (
            courses.map((course: CourseInterface) => (
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
                      }}
                    />
                  }
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    width: "200px",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                  }}
                >
                  <Meta title={course.Title} description={`Tutor: ${user?.Username ?? "ไม่ระบุ"}`} />
                  <div style={{ 
                    marginTop: "5px", 
                    display: "flex", 
                    alignItems: "center", 
                    fontSize: "12px", 
                    gap: "5px" 
                  }}>
                    <Star size={15} weight="fill" style={{ color: "#ffcc00" }} />
                    <span>
                      {averageRatings[course.ID || 0] || 0} ({reviews[course.ID || 0]?.length || 0} รีวิว)
                    </span>
                  </div>
                  <div style={{ 
                    marginTop: "5px", 
                    fontWeight: "bold", 
                    color: "#ff4500", 
                    fontSize: "14px" 
                  }}>
                    <span className="currency">฿</span>
                    {Number(course.Price?.toFixed(2)).toLocaleString(undefined, 
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <Empty description="ไม่พบคอร์ส" />
          )}
          <div style={{ 
            flex: "none", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            width: "100px" 
          }}>
            <div onClick={() => handleAllCourseClick(0)}>
              <Button type="link" style={{ 
                display: "block", 
                textAlign: "center", 
                color: "#002A48", 
                margin: "10px 0" 
              }}>
                ดูเพิ่มเติม
              </Button>
            </div>
          </div>
        </div>

        {categories.map((category) => {
          const filteredCourses = courses.filter(course => course.CourseCategoryID === category.ID);
          
          return (
            <div key={category.ID} style={{ marginBottom: "20px" }}>
              <h2 style={{ 
                fontSize: "30px", 
                color: "#002A48", 
                fontWeight: "bold", 
                marginBottom: "20px",
                marginTop: "20px", 
              }}>
                {category.CategoryName}
              </h2>
              <div style={{ 
                display: "flex", 
                flexDirection: "row", 
                overflowX: "auto", 
                gap: "15px", 
                paddingBottom: "15px" 
              }}>
                {filteredCourses.length > 0 ? (
                  filteredCourses.slice(0, 10).map((course: CourseInterface) => (
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
                            }}
                          />
                        }
                        style={{
                          borderRadius: "15px",
                          overflow: "hidden",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          width: "200px",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                        }}
                      >
                        <Meta title={course.Title} description={`Tutor: ${user?.Username ?? "ไม่ระบุ"}`} />   
                        <div style={{ 
                          marginTop: "5px", 
                          display: "flex", 
                          alignItems: "center", 
                          fontSize: "12px", 
                          gap: "5px" 
                        }}>
                          <Star size={15} weight="fill" style={{ color: "#ffcc00" }} />
                          <span>
                            {averageRatings[course.ID || 0] || 0} ({reviews[course.ID || 0]?.length || 0} รีวิว)
                          </span>
                        </div>
                        <div style={{ 
                          marginTop: "5px", 
                          fontWeight: "bold", 
                          color: "#ff4500", 
                          fontSize: "14px" 
                        }}>
                          <span className="currency">฿</span>
                          {Number(course.Price?.toFixed(2)).toLocaleString(undefined, 
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </Card>
                    </div>
                  ))
                ) : (
                  <Empty description="ไม่พบคอร์สในหมวดหมู่นี้" />
                )}
                <div style={{ 
                  flex: "none", 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  width: "100px" 
                }}>
                  <div onClick={() => handleAllCourseClick(category.ID || 0)}>
                    <Button type="link" style={{ 
                      display: "block", 
                      textAlign: "center", 
                      color: "#002A48", 
                      margin: "10px 0" 
                    }}>
                      ดูเพิ่มเติม
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}

export default Course;
