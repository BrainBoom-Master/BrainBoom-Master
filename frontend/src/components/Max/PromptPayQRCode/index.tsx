import React, { useState, useEffect } from "react";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

interface Props {
  mobileNumber: string;
  amount?: number;
}

const PromptPayQRCode: React.FC<Props> = ({ mobileNumber, amount }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    const generatePromptPayQR = async () => {
      try {
        const payload: string = generatePayload(mobileNumber, { amount });
        const qrCodeDataUrl: string = await QRCode.toDataURL(payload);
        setQrCodeUrl(qrCodeDataUrl);
      } catch (error) {
        console.error("Error generating QR Code: ", error);
        setQrCodeUrl("");
      }
    };

    generatePromptPayQR();
  }, [mobileNumber, amount]);

  if (qrCodeUrl === null) {
    return <div>Loading...</div>;
  }

  return qrCodeUrl ? (
    <img src={qrCodeUrl} alt="PromptPay QR Code" />
  ) : (
    <div>Error generating QR Code</div>
  );
};

export default PromptPayQRCode;
