import React from "react";
import { Form, Input, Button, message, Upload } from "antd";
import ReactDOM from "react-dom";
import { ReviewInterface } from "../../../../interfaces/IReview";
import { CreateReview } from "../../../../services/https";
import { useNavigate } from "react-router-dom";
import StarRating from "../../../../Feature/Star";
import "../popup.css";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import type { GetProp, UploadFile, UploadProps } from "antd";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  CourseID: number;
  UserID: number;
  onReviewSubmit: (courseId: number) => void; // ฟังก์ชันที่เรียกเมื่อรีวิวเสร็จ
}

const ModalCreate: React.FC<ModalProps> = ({
  open,
  onClose,
  CourseID,
  UserID,
  onReviewSubmit,
}) => {
  if (!open) return null;

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [rating, setRating] = React.useState<number | undefined>(undefined);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
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
      const res = await CreateReview({
        ...values,
        Rating: rating,
        CourseID: CourseID,
        Picture: profileImage,
        UserID: UserID,
      });
      if (res) {
        messageApi.open({
          type: "success",
          content: "การรีวิวสำเร็จเเล้ว",
        });
        onReviewSubmit(CourseID); // อัปเดตสถานะการรีวิวทันทีหลังจากบันทึกสำเร็จ
        setTimeout(() => {
          onClose();
          navigate("/myCourses");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "การรีวิวไม่สำเร็จ",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An error occurred!",
      });
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <>
      {contextHolder}
      <div className="overlay" />
      <div className="modal">
        <div>
          <p className="text">Review Course</p>
          <Form
            form={form}
            name="reviewForm"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="รูปประจำตัว"
              name="Profile"
              valuePropName="fileList"
            >
              <ImgCrop rotationSlider>
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
                    <div style={{ marginTop: 8 }}>อัพโหลด</div>
                  </div>
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item>
              <StarRating rating={rating ?? 0} onRatingChange={setRating} />
            </Form.Item>

            <Form.Item
              name="Comment"
              label="Review"
              rules={[{ required: true, message: "Please enter your review!" }]}
            >
              <Input.TextArea rows={4} style={{ width: "400px" }} />
            </Form.Item>

            <Form.Item className="box-button-reviews">
              <Button type="default" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: "8px" }}
                loading={loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModalCreate;