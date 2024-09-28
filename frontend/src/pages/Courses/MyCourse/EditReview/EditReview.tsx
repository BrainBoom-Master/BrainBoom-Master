import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Upload } from "antd";
import ReactDOM from "react-dom";
import { ReviewInterface } from "../../../../interfaces/IReview";
import { UpdateReview, GetReviewsByID } from "../../../../services/https"; // ใช้ UpdateReview
import { useNavigate } from "react-router-dom";
import StarRating from "../../../../Feature/Star";
import "../popup.css";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import type { UploadFile, UploadProps } from "antd";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  CourseID: number;
  UserID: number;
  onReviewSubmit: (courseId: number) => void; // ฟังก์ชันที่จะเรียกเมื่อรีวิวถูกส่ง
  reviewId: number; // ส่ง ID ของรีวิวที่มีอยู่
}

const ModalEdit: React.FC<ModalProps> = ({
  open,
  onClose,
  CourseID,
  UserID,
  onReviewSubmit,
  reviewId, // รับ ID ของรีวิว
}) => {
  if (!open) return null;

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [rating, setRating] = React.useState<number | undefined>(undefined);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [reviews, setReviews] = useState<ReviewInterface>();

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = async (values: ReviewInterface) => {
    if (rating === undefined || rating < 1) {
      messageApi.open({
        type: "warning",
        content: "กรุณาให้คะแนนหลักสูตร!",
      });
      return;
    }

    const profileImage = fileList[0]?.thumbUrl || undefined;

    setLoading(true);
    try {
      const res = await UpdateReview(reviewId, {
        // ใช้ UpdateReview แทน CreateReview
        ...values,
        Rating: rating,
        CourseID: CourseID,
        Picture: profileImage,
        UserID: UserID,
      });
      if (res) {
        messageApi.open({
          type: "success",
          content: "เเก้ไขรีวิวสำเร็จ",
        });
        onReviewSubmit(CourseID); // อัปเดตสถานะการรีวิวทันทีหลังจากบันทึก
        setTimeout(() => {
          onClose();
          navigate("/myCourses");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "เเก้ไขรีวิวไม่สำเร็จ!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const GetMemberid = async () => {
      const res = await GetReviewsByID(reviewId);
      if (res) {
        setReviews(res.data);
        form.setFieldsValue({
          Rating: res.data.Rating,
          Comment: res.data.Comment,
        });
        setRating(res.data.Rating); // ตั้งค่า rating ตามข้อมูลที่ดึงมา
        if (res.data.Picture) {
          setFileList([
            {
              uid: '-1',
              name: 'profile.png', // หรือชื่อไฟล์ที่เหมาะสม
              status: 'done',
              url: res.data.Picture, // ใช้ URL ของรูปโปรไฟล์ที่มีอยู่
            },
          ]);
        }
      }
    };
    GetMemberid();
  }, [reviewId, form]);
  

  return ReactDOM.createPortal(
    <>
      {contextHolder}
      <div className="overlay" />
      <div className="modal">
        <div>
          <p className="text">Edit Review</p>
          <Form
            form={form}
            name="reviewForm"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="รูปโปรไฟล์"
              name="Picture"
              valuePropName="fileList"
            >
              <ImgCrop aspect={1} rotationSlider>
                <Upload
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={(file) => {
                    setFileList([...fileList, file]);
                    return false;
                  }}
                  maxCount={1}
                  multiple={false}
                  listType="picture-card"
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>อัปโหลด</div>
                  </div>
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item>
              <StarRating rating={rating ?? 0} onRatingChange={setRating} />
            </Form.Item>

            <Form.Item
              label="ความคิดเห็น"
              name="Comment"
              rules={[{ required: true, message: "กรุณากรอกความคิดเห็น!" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Button className="button-close" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModalEdit;
