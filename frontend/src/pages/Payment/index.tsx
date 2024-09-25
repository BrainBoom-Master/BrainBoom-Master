import {
  Layout,
  Button,
  Input,
  Card,
  Divider,
  Row,
  Col,
  ConfigProvider,
  message,
  //Upload,
} from "antd";
//import jsQR from "jsqr";
import { useState } from "react";
import HeaderComponent from "../../components/header";
import { CreditCardOutlined /*UploadOutlined*/ } from "@ant-design/icons";
import { createStyles } from "antd-style";
import PromptPayIcon from "../../components/Max/PromptPayIcon";
import PromptPayQRCode from "../../components/Max/PromptPayQRCode";
import { useLocation, useNavigate } from "react-router-dom";
import { PaymentsInterface } from "../../interfaces/IPayment";
import { CreditCardInterface } from "../../interfaces/ICreditCard";
import { PromptPayInterface } from "../../interfaces/IPromptpay";
import {
  CreateCreditCard,
  CreatePayment,
  CreatePromptPay,
} from "../../services/https";

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
      &.${prefixCls}-btn-primary:not([disabled]):not(
          .${prefixCls}-btn-dangerous
        ) {
        border-width: 0;
  
        > span {
          position: relative;
        }
  
        &::before {
          content: "";
          background: linear-gradient(
            135deg,
            rgba(2, 0, 36, 1) 0%,
            rgba(211, 172, 43, 1) 100%
          );
          position: absolute;
          inset: 0;
          opacity: 1;
          transition: all 0.3s ;
          border-radius: inherit;
        }
  
        &:hover::before {
          opacity: 0;
          );
        }
      }
    `,
}));

const textErrorStyle = {
  color: "red",
  marginBottom: "5px",
  paddingLeft: "11px",
};

const { Content } = Layout;

function Payment() {
  const recipientNumber = "0631456442";

  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;

  const { styles } = useStyle();
  const user_id = Number(localStorage.getItem("id") || 0);

  const [messageApi, contextHolder] = message.useMessage();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [formattedValue, setFormattedValue] = useState("");
  const [rawValue, setRawValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [promptPayNumber, setpromptPayNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [errorCardNumber, setErrorCardNumber] = useState(false);
  const [errorCVC, setErrorCVC] = useState(false);
  const [errorExpiry, setErrorExpiry] = useState("");
  // const [uploadError, setUploadError] = useState<boolean>(false);
  // const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  // const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  // const [canvasImage, setCanvasImage] = useState<string | null>(null);

  const formatExpiryDate = (value: string) => {
    const cleanedValue = value.replace(/[^\d]/g, "");
    if (cleanedValue.length <= 2) {
      return cleanedValue;
    } else {
      return `${cleanedValue.slice(0, 2)} / ${cleanedValue.slice(2, 4)}`;
    }
  };

  // ฟังก์ชันสำหรับจัดรูปแบบตัวเลขให้มีช่องว่างทุก 4 ตัว
  const formatNumber = (num: string) => {
    return num
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const validateExpiryDate = (newMonth: string, newYear: string) => {
    const currentYear = new Date().getFullYear() % 100;
    const monthNumber = parseInt(newMonth, 10);
    const yearNumber = parseInt(newYear, 10);

    if (newMonth && (monthNumber < 1 || monthNumber > 12)) {
      setErrorExpiry("เดือนไม่ถูกต้อง");
      return false;
    }

    if (newYear && yearNumber < currentYear) {
      setErrorExpiry("ปีไม่ถูกต้อง");
      return false;
    }

    setErrorExpiry("");
    return true;
  };

  const [creditCardData, setCreditCardData] = useState<CreditCardInterface>({
    UserID: user_id,
    CardNumber: "",
    HashedCardNumber: "",
    CardHolderName: "",
    ExpirationMonth: "",
    ExpirationYear: "",
  });

  const [promptpayData, setPromptpayData] = useState<PromptPayInterface>({
    UserID: user_id,
    PromptPayNumber: "",
  });

  const [paymentData, setPaymentData] = useState<PaymentsInterface>({
    Amount: course.Price,
    UserID: user_id,
    CourseID: course.ID,
    PaymentMethodID: 0,
    CreditCardID: undefined,
    PromptPayID: undefined,
  });

  const handleExpiryDateInputChange = (e: { target: { value: string } }) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);

    const [newMonth, newYear] = formattedValue.split(" / ");

    setMonth(newMonth || "");
    setYear(newYear || "");

    if (newMonth && newYear) {
      validateExpiryDate(newMonth, newYear);
    }
  };

  const handlePhoneNumberChange = (e: { target: { value: string } }) => {
    const inputValue = e.target.value.replace(/[^\d]/g, ""); // เอาเฉพาะตัวเลข
    if (
      inputValue.match(/^\d*$/) &&
      (inputValue.length <= 13 || inputValue.length <= 10)
    ) {
      setpromptPayNumber(inputValue);
    }
  };

  const handleCardNumberChange = (e: { target: { value: string } }) => {
    const inputValue = e.target.value.replace(/[^\d]/g, ""); // เอาเฉพาะตัวเลข
    if (inputValue.length <= 16)
      setErrorCardNumber(inputValue.length < 16 && inputValue.length > 0);
    setRawValue(inputValue); // เก็บค่าที่เป็นตัวเลขอย่างเดียว
    setFormattedValue(formatNumber(inputValue)); // เก็บค่าที่จัดรูปแบบแล้ว
  };

  const handleCvcChange = (e: { target: { value: string } }) => {
    const inputValue = e.target.value.replace(/[^\d]/g, ""); // only digits
    if (inputValue.length <= 3) {
      setErrorCVC(inputValue.length < 3 && inputValue.length > 0);
    }
    setCvc(inputValue);
  };

  const handleMethodChange = (method: string) => {
    setPaymentMethod(method);

    if (method !== "PromptPay") {
      setpromptPayNumber("");
    }

    if (method !== "CreditCard") {
      setFormattedValue("");
      setRawValue("");
      setExpiryDate("");
      setCvc("");
      setCardName("");
    }
  };

  const handleCheckout = async () => {
    if (paymentMethod === "CreditCard") {
      const checkCVC = cvc;
      const newCreditCardData = {
        ...creditCardData,
        CardNumber: rawValue,
        HashedCardNumber: rawValue,
        CardHolderName: cardName,
        ExpirationMonth: month,
        ExpirationYear: year,
      };
      console.log(newCreditCardData);

      if (
        newCreditCardData.CardNumber === "" ||
        newCreditCardData.ExpirationMonth === "" ||
        newCreditCardData.ExpirationYear === "" ||
        newCreditCardData.CardHolderName === "" ||
        newCreditCardData.CardNumber.length < 16 ||
        newCreditCardData.ExpirationMonth.length < 2 ||
        newCreditCardData.ExpirationYear.length < 2 ||
        checkCVC.length < 3
      ) {
        messageApi.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      setCreditCardData(newCreditCardData);
      console.log(creditCardData);

      try {
        const response = await CreateCreditCard(newCreditCardData);
        console.log(response);

        // ตรวจสอบว่า response ไม่ใช่ null ก่อนที่จะเข้าถึง creditCardId
        if (response) {
          const creditCardID = response.creditCardId; // เข้าถึง creditCardId
          console.log("CreditCard ID:", creditCardID);

          const newPaymentCreditCardData = {
            ...paymentData,
            PaymentMethodID: 1,
            CreditCardID: creditCardID,
          };

          setPaymentData(newPaymentCreditCardData);
          console.log(paymentData);

          await CreatePayment(newPaymentCreditCardData);
          messageApi.success("บันทึกการชำระเงินเรียบร้อยแล้ว");
          handlePaymentClick();
        } else {
          messageApi.error("ไม่สามารถสร้างบัตรเครดิตได้");
        }
      } catch (error) {
        console.error("Error creating credit card or payment:", error);
        messageApi.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } else if (paymentMethod === "PromptPay") {
      const newPromptPayData = {
        ...promptpayData,
        PromptPayNumber: promptPayNumber,
      };
      setPromptpayData(newPromptPayData);
      console.log(newPromptPayData);

      if (
        newPromptPayData.PromptPayNumber === "" ||
        (newPromptPayData.PromptPayNumber.length !== 10 &&
          newPromptPayData.PromptPayNumber.length !== 13)
      ) {
        messageApi.error(
          "หมายเลขพร้อมเพย์ต้องมีความยาว 10 หรือ 13 หลักเท่านั้น"
        );
        return;
      }

      try {
        const response = await CreatePromptPay(newPromptPayData);
        console.log(response);

        // ตรวจสอบว่า response ไม่ใช่ null ก่อนที่จะเข้าถึง promptpayId
        if (response) {
          const promptpayId = response.promptpayId; // เข้าถึง promptpayId
          console.log("PromptPay ID:", promptpayId);

          const newPaymentPromptPayData = {
            ...paymentData,
            PaymentMethodID: 2,
            PromptPayID: promptpayId,
          };

          setPaymentData(newPaymentPromptPayData);
          console.log(paymentData);

          await CreatePayment(newPaymentPromptPayData);
          messageApi.success("บันทึกการชำระเงินเรียบร้อยแล้ว");
          handlePaymentClick();
        } else {
          messageApi.error("ไม่สามารถสร้างพร้อมเพย์ได้");
        }
      } catch (error) {
        console.error("Error creating promptpay or payment:", error);
        messageApi.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    }
  };

  const handlePaymentClick = () => {
    setTimeout(() => {
      navigate(`/course/${course.id}`, { state: { course } });
    }, 1000);
  };

  // const handleImageUpload = (file: File) => {
  //   const reader = new FileReader();
  //   reader.onload = (e: ProgressEvent<FileReader>) => {
  //     const img = new Image();
  //     img.src = e.target?.result as string;
  //     setUploadedImage(URL.createObjectURL(file));

  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const ctx = canvas.getContext("2d");
  //       if (!ctx) {
  //         message.error("ไม่สามารถสร้าง canvas context ได้");
  //         return;
  //       }

  //       // ปรับขนาด canvas ให้เท่ากับขนาดภาพ
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       // วาดภาพลงบน canvas
  //       ctx.drawImage(img, 0, 0, img.width, img.height);

  //       // ดึงข้อมูลภาพ
  //       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  //       // ปรับปรุงภาพ
  //       const enhancedImageData = enhanceImage(imageData);

  //       // อ่าน QR Code
  //       const qrCode = jsQR(
  //         enhancedImageData.data,
  //         canvas.width,
  //         canvas.height
  //       );
  //       console.log(qrCode);

  //       if (qrCode) {
  //         const parsedData = parseQRCode(qrCode.data);
  //         console.log(parsedData);

  //         if (verifyQRCode(parsedData)) {
  //           setUploadSuccess(true);
  //           setUploadError(false);
  //           message.success("สลิปถูกต้อง");
  //         } else {
  //           setUploadSuccess(false);
  //           setUploadError(true);
  //           message.error("ตรวจสอบสลิปไม่สำเร็จ");
  //         }
  //       } else {
  //         setUploadSuccess(false);
  //         setUploadError(true);
  //         message.error("ไม่พบ QR Code ในภาพ");
  //       }

  //       // แสดงภาพที่ปรับปรุงแล้ว (ตัวอย่าง)
  //       ctx.putImageData(enhancedImageData, 0, 0);
  //       const canvasURL = canvas.toDataURL();
  //       setCanvasImage(canvasURL);
  //     };
  //   };
  //   reader.readAsDataURL(file);
  // };

  // const enhanceImage = (imageData: ImageData): ImageData => {
  //   const data = imageData.data;

  //   // แปลงเป็น grayscale และเพิ่มความคมชัด
  //   for (let i = 0; i < data.length; i += 4) {
  //     const r = data[i];
  //     const g = data[i + 1];
  //     const b = data[i + 2];

  //     // แปลงเป็น grayscale
  //     const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

  //     // เพิ่มความคมชัด (ตัวอย่างง่ายๆ)
  //     const enhanced = Math.min(255, Math.max(0, gray * 1.5 - 30));

  //     // Threshold (ทำให้เป็นขาวดำสมบูรณ์)
  //     const threshold = enhanced > 128 ? 255 : 0;

  //     data[i] = threshold;
  //     data[i + 1] = threshold;
  //     data[i + 2] = threshold;
  //   }

  //   return imageData;
  // };

  // const verifyQRCode = (parsedData: {
  //   amount: string;
  //   promptPayNumber: string;
  // }): boolean => {
  //   const { amount, promptPayNumber } = parsedData;

  //   // ตรวจสอบว่าราคาตรงกับราคาคอร์สหรือไม่
  //   const isPriceMatch = parseFloat(amount) === course.Price;

  //   // ตรวจสอบว่า PromptPay Number ตรงกับหมายเลขที่ระบบกำหนดหรือไม่
  //   const isPromptPayMatch = promptPayNumber === recipientNumber;

  //   return isPriceMatch && isPromptPayMatch;
  // };

  // const parseQRCode = (
  //   qrData: string
  // ): { amount: string; promptPayNumber: string } => {
  //   const parsedData: { [key: string]: string } = {};

  //   // ฟังก์ชันสำหรับการแยกข้อมูลในรูปแบบ Tag-Length-Value
  //   const parseTLV = (data: string) => {
  //     let i = 0;
  //     while (i < data.length) {
  //       const tag = data.slice(i, i + 2); // Tag เช่น 00, 54
  //       const length = parseInt(data.slice(i + 2, i + 4)); // Length ของข้อมูล
  //       const value = data.slice(i + 4, i + 4 + length); // ข้อมูลจริง (Value)

  //       parsedData[tag] = value;
  //       i += 4 + length; // ไปยังตำแหน่งถัดไป
  //     }
  //   };

  //   // เรียกฟังก์ชันเพื่อแยกข้อมูล
  //   parseTLV(qrData);

  //   // ดึงข้อมูลที่ต้องการออกมา
  //   const amount = parsedData["54"] || "0.00"; // Tag 54 คือจำนวนเงิน
  //   const promptPayNumber = parsedData["29"] || ""; // Tag 29 คือหมายเลข PromptPay

  //   return { amount, promptPayNumber };
  // };

  return (
    <>
      {contextHolder}
      <ConfigProvider
        button={{ className: styles.linearGradientButton }}
        theme={{
          components: {
            Card: {
              colorText: "#002A48",
            },
            Button: {
              defaultHoverColor: "black",
              defaultActiveBorderColor: "#D3AC2B",
            },
          },
        }}
      >
        <HeaderComponent />
        <Content
          style={{
            backgroundColor: "white",
            height: "100%",
            padding: "0 50px",
          }}
        >
          <Row gutter={32}>
            {/* Left Section: Payment Form */}
            <Col span={14}>
              <Card
                type="inner"
                title={
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#002A48",
                    }}
                  >
                    Checkout
                  </span>
                }
                bordered={true}
                style={{ textAlign: "start", marginTop: "100px" }}
              >
                <h2>Payment method</h2>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    flexDirection: "row",
                  }}
                >
                  <Button
                    icon={<CreditCardOutlined style={{ fontSize: "24px" }} />}
                    size="large"
                    style={{
                      backgroundColor: "white",
                      borderColor: "rgba(0, 0, 0, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "250px",
                      height: "50px",
                      fontWeight: "630",
                    }}
                    onClick={() => handleMethodChange("CreditCard")}
                  >
                    <div style={{ fontSize: "16px" }}>Credit/Debit Card</div>
                  </Button>
                  <Button
                    size="large"
                    style={{
                      backgroundColor: "white",
                      borderColor: "rgba(0, 0, 0, 0.3)",
                      width: "250px",
                      height: "50px",
                    }}
                    onClick={() => handleMethodChange("PromptPay")}
                  >
                    <PromptPayIcon />
                  </Button>
                </div>

                {paymentMethod === "CreditCard" && (
                  <div>
                    <h3>Card Information</h3>
                    <Input
                      value={formattedValue}
                      onChange={handleCardNumberChange}
                      placeholder="1234 1234 1234 1234"
                      size="large"
                      style={{ marginBottom: "10px" }}
                      maxLength={19}
                    />
                    {errorCardNumber && (
                      <p style={textErrorStyle}>
                        กรุณากรอกเลขบัตรให้ครบ 16 หลัก
                      </p>
                    )}
                    <Row gutter={8} style={{ marginBottom: "10px" }}>
                      <Col span={12}>
                        <Input
                          placeholder="MM / YY"
                          value={expiryDate}
                          onChange={handleExpiryDateInputChange}
                          maxLength={7}
                          size="large"
                        />
                        {errorExpiry && (
                          <p style={textErrorStyle}>{errorExpiry}</p>
                        )}
                      </Col>
                      <Col span={12}>
                        <Input
                          value={cvc}
                          onChange={handleCvcChange}
                          placeholder="CVC"
                          size="large"
                          maxLength={3}
                        />
                        {errorCVC && (
                          <p style={textErrorStyle}>กรุณากรอก CVC ให้ครบถ้วน</p>
                        )}
                      </Col>
                    </Row>
                    <Input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      size="large"
                      style={{ marginBottom: "20px" }}
                    />
                  </div>
                )}

                {paymentMethod === "PromptPay" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h3>PromptPay QR Code</h3>
                    <Input
                      placeholder="หมายเลขพร้อมเพย์"
                      value={promptPayNumber}
                      onChange={handlePhoneNumberChange}
                      maxLength={13}
                      size="large"
                      style={{
                        padding: "8px",
                        marginBottom: "20px",
                        textAlign: "center",
                      }}
                    />
                    {(promptPayNumber.length === 10 ||
                      promptPayNumber.length === 13) && (
                      <PromptPayQRCode
                        mobileNumber={recipientNumber}
                        amount={course.Price}
                      />
                    )}

                    {/* <Upload
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleImageUpload(file);
                        return false; // ไม่อัปโหลดโดยตรง
                      }}
                    >
                      <Button icon={<UploadOutlined />}>อัปโหลดสลิป</Button>
                    </Upload>

                    {uploadError && (
                      <p style={{ color: "red" }}>ตรวจสอบสลิปไม่สำเร็จ</p>
                    )}
                    {uploadSuccess && (
                      <p style={{ color: "green" }}>สลิปถูกต้อง</p>
                    )}
                    <div>
                      {canvasImage && (
                        <img src={canvasImage} alt="Canvas Output" />
                      )}
                    </div> */}
                  </div>
                )}

                <h3>Order details</h3>
                <Card
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  styles={{ body: { width: "100%" } }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: "100%",
                      width: "100%",
                      flexDirection: "row",
                    }}
                  >
                    <span style={{ flexGrow: 1 }}>
                      {course.Title || "Loading..."}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {course.Price !== undefined
                        ? `THB ${course.Price.toLocaleString()}`
                        : "Loading..."}
                    </span>
                  </div>
                </Card>
              </Card>
            </Col>

            <Col span={10}>
              <Card
                type="inner"
                title={
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#002A48",
                    }}
                  >
                    Summary
                  </span>
                }
                bordered={true}
                style={{ textAlign: "start", marginTop: "100px" }} // เพิ่ม margin
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <span>Original Price:</span>
                  <span>
                    {course.Price !== undefined
                      ? `THB ${course.Price.toLocaleString()}`
                      : "Loading..."}
                  </span>
                </div>
                <Divider />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "20px",
                  }}
                >
                  <span>Total:</span>
                  <span>
                    {course.Price !== undefined
                      ? `THB ${course.Price.toLocaleString()}`
                      : "Loading..."}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Button
                    onClick={() => navigate(-1)}
                    size="large"
                    style={{
                      width: "48%",
                      fontWeight: "bold",
                    }}
                    danger
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleCheckout}
                    size="large"
                    style={{
                      width: "48%",
                      fontWeight: "bold",
                      backgroundColor: "rgba(211,172,43,0.85)",
                    }}
                  >
                    ชำระเงิน
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </ConfigProvider>
    </>
  );
}

export default Payment;
