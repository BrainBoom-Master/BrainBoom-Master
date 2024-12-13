import React, { useState, useEffect } from "react";
import HeaderComponent from "../../../components/header";
import Modal from "./CreateReview/Pop_Up";
import ModalEdit from "./EditReview/EditReview";
import { GetReviewById, GetPaymentByIdUser, GetUserByTutorId } from "../../../services/https";
import { Card, message } from "antd";
import { PaymentsReviewInterface } from "../../../interfaces/IPayment";
import { useNavigate } from "react-router-dom";
import "./popup.css";
import { CourseInterface } from "../../../interfaces/ICourse";
import { UsersInterface } from "../../../interfaces/IUser";

const Review: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);
  const [currentReviewId, setCurrentReviewId] = useState<number | null>(null);
  const [hasReviewed, setHasReviewed] = useState<{ [key: number]: boolean }>({});
  const [payments, setPayments] = useState<PaymentsReviewInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [uid, setUid] = useState<number>(Number(localStorage.getItem("id")) || 0);
  const navigate = useNavigate();
  const [user, setUser] = useState<UsersInterface>();

  useEffect(() => {
    setUid(Number(localStorage.getItem("id")));
    const fetchAllReviewsAndPayments = async () => {
      const reviewStatus: { [key: number]: boolean } = {};
      const paymentsData = await GetPaymentByIdUser(uid);

      if (!paymentsData || paymentsData.length === 0) return;

      for (const payment of paymentsData) {
        const reviews = await GetReviewById(payment.CourseID);
        const userReview = reviews.find((review) => review.UserID === uid);
        reviewStatus[payment.CourseID!] = !!userReview;
      }

      setHasReviewed(reviewStatus);
      setPayments(paymentsData);
    };

    fetchAllReviewsAndPayments();
  }, [uid]);

  const handleCourseClick = (course: CourseInterface) => {
    navigate(`/course/${course.ID}`, { state: { course } });
  };

  const openModal = async (id: number) => {
    if (hasReviewed[id]) {
      setCurrentCourseId(id);
      setIsEditOpen(true);
      const reviews = await GetReviewById(id);
      const userReview = reviews.find((review) => review.UserID === uid);
      setCurrentReviewId(userReview?.ID || null);
      return;
    }
    setCurrentCourseId(id);
    setIsOpen(true);
  };

  const handleReviewSubmit = (courseId: number) => {
    setHasReviewed((prevState) => ({
      ...prevState,
      [courseId]: true,
    }));
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
    if (payments.length > 0 && !user) {
      const tutorProfileID = payments[0].Course.TutorProfileID;
      if (tutorProfileID !== undefined) {
        getUser(tutorProfileID.toString());
      } else {
        messageApi.error('ไม่สามารถดำเนินการได้');
      }
    }
  }, [payments, user, messageApi]);

  return (
    <>
      {contextHolder}
      <HeaderComponent />
      <br />
      <br />
      <br />
      <br />
      <div className="header-course">MyCourse</div>
      <div className="setcourse">
        <div className="review-layer">
          {payments.map((payment, index) => (
            <Card key={index} className="product-review">     
              <img
                src={payment.Course.ProfilePicture}
                alt={`${payment.Course.Title} Course`}
                onClick={() => handleCourseClick(payment.Course)}
              />
              <div className="text-product">
                <strong>ชื่อ : {payment.Course.Title}</strong>
                <br />
                Tutor ID : {user?.Username}
                <div className="button-open">
                  {hasReviewed[payment.CourseID!] ? (
                    <button
                      className="button-open-model"
                      onClick={() => openModal(payment.CourseID!)}
                    >
                      Edit Review
                    </button>
                  ) : (
                    <button
                      className="button-open-model"
                      onClick={() => openModal(payment.CourseID!)}
                    >
                      Review Course
                    </button>
                  )}
                  {currentCourseId === payment.CourseID && isOpen && (
                    <Modal
                      open={isOpen}
                      onClose={() => setIsOpen(false)}
                      CourseID={currentCourseId!}
                      UserID={uid}
                      onReviewSubmit={handleReviewSubmit}
                    />
                  )}
                  {currentCourseId === payment.CourseID && isEditOpen && currentReviewId !== null && (
                    <ModalEdit
                      open={isEditOpen}
                      onClose={() => setIsEditOpen(false)}
                      CourseID={currentCourseId!}
                      UserID={uid}
                      onReviewSubmit={handleReviewSubmit}
                      reviewId={currentReviewId}
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Review;
