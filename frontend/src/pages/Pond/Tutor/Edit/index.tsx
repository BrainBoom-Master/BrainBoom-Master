import HeaderComponent from '../../../components/header';
import { Typography } from 'antd';
const { Title } = Typography;
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
const { TextArea } = Input;

function Edit() {
  return (
    <>
      <HeaderComponent />
      <section
        style={{
          padding: "95px 50px 30px 50px",
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row', 
            margin: '0px auto',
            maxWidth: '1200px',
            borderRadius: '20px',
            border: '2px solid #e0e0e0',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            padding: '50px 100px',
            backgroundColor: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            gap: '40px', 
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '30%',
              gap: '15px',
            }}
          >
            <Title level={2} style={{ color: '#333d51' }}>แก้ไข</Title>
            <div style={{ width: '250px', height: '250px' }}>
              <img
                src="https://via.placeholder.com/150x150"
                alt=""
                style={{ width: '100%', height: '100%', borderRadius: '20px' }}
              />
            </div>
          </div>

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '70%',
              justifyContent: 'center',
              padding: '20px',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                placeholder="ชื่อหลักสูตร"
                style={{
                  padding: '12px 15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              />
              <div style={{ display: 'flex', gap: '20px' }}>
                <Input
                  placeholder="เวลาในการเรียน"
                  style={{
                    padding: '12px 15px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Input
                  placeholder="จำนวนบท"
                  style={{
                    padding: '12px 15px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </div>
            </div>
            <Input
              placeholder="รูปแบบในการเรียน"
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                fontSize: '16px',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            />
            <TextArea
              placeholder="คำอธิบาย"
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                fontSize: '16px',
                height: '150px',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '20px' }}>
              <Input
                placeholder="ราคา"
                style={{
                  padding: '12px 15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Link to="/tuter">
                <Button
                  type="primary"
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#333d51',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    width: '150px',
                    height: '50px',
                  }}
                >
                  ยืนยัน
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Edit;
