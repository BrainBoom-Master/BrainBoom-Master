import {
  Layout,
  Button,
  Input,
  Card,
  Divider,
  Row,
  Col,
  ConfigProvider,
} from "antd";
import { useState } from "react";
import HeaderComponent from "../../components/header";
import { CreditCardOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import PromptPayIcon from "../../components/Max/PromptPayIcon";
import PromptPayQRCode from "../../components/Max/PromptPayQRCode";
//import { GetPriceById, GetTitleById } from "../../services/https";
import { useLocation } from "react-router-dom";

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

const { Content } = Layout;

function Payment() {
  const { styles } = useStyle();

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const handleMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const location = useLocation();
  const course = location.state?.course;

  return (
    <ConfigProvider
      button={{ className: styles.linearGradientButton }}
      theme={{
        components: {
          Card: {
            headerFontSize: 40,
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
        <Content style={{ backgroundColor: "white" ,height:"100%"}}>
          <Row gutter={32}>
            {/* Left Section: Payment Form */}
            <Col span={14}>
              <Card
                type="inner"
                title={<span style={{ fontSize: "24px", fontWeight: "bold"}}>Checkout</span>}
                bordered={true}
                style={{ textAlign: "start",marginTop:"100px" }}
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
                    onClick={() => handleMethodChange("card")}
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
                    onClick={() => handleMethodChange("promptpay")}
                  >
                    <PromptPayIcon />
                  </Button>
                </div>

                {paymentMethod === "card" && (
                  <div>
                    <h3>Card Information</h3>
                    <Input
                      placeholder="1234 1234 1234 1234"
                      size="large"
                      style={{ marginBottom: "10px"  }}
                    />
                    <Row gutter={8} style={{ marginBottom: "10px" }}>
                      <Col span={12}>
                        <Input placeholder="MM / YY" size="large" />
                      </Col>
                      <Col span={12}>
                        <Input placeholder="CVC" size="large" />
                      </Col>
                    </Row>
                    <Input
                      placeholder="Name on card"
                      size="large"
                      style={{ marginBottom: "20px" }}
                    />
                  </div>
                )}

                {paymentMethod === "promptpay" && (
                  <div>
                    <h3>Generate PromptPay QR Code</h3>
                    <PromptPayQRCode
                      mobileNumber="0631456442"
                      amount={course.Price}
                    />
                  </div>
                )}

                <h3>Order details</h3>
                <Card
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  styles={{body:{width:"100%"}}}
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
                title={<span style={{ fontSize: "24px", fontWeight: "bold"}}>Summary</span>}
                bordered={true}
                style={{ textAlign: "start",marginTop:"100px" }} // เพิ่ม margin
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
                <Button
                  type="primary"
                  size="large"
                  style={{
                    width: "100%",
                    fontWeight: "bold",
                    backgroundColor: "rgba(211,172,43,0.85)",
                  }}
                >
                  Complete Checkout
                </Button>
              </Card>
            </Col>
          </Row>
        </Content>
    </ConfigProvider>
  );
}

export default Payment;
