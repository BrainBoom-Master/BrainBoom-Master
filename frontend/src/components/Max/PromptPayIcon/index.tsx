function PromptPay_Icon() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(51, 100, 137, 1)",
          color: "white",
          padding: "4px 1px",
          fontSize: "24px",
          textAlign: "center",
          lineHeight: "1",
          borderRadius: "2px",
        }}
      >
        Prompt
      </div>
      <div
        style={{
          fontSize: "26px",
          color: "rgba(51, 100, 137, 1)",
          marginTop: "4px",
          lineHeight: "1",
        }}
      >
        Pay
      </div>
    </div>
  );
}

export default PromptPay_Icon;
