package config

import ("golang.org/x/crypto/bcrypt"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"crypto/sha256"
	"io"
)

// hashPassword เป็น function สำหรับการแปลง password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// checkPasswordHash เป็น function สำหรับ check password ที่ hash แล้ว ว่าตรงกันหรือไม่
func CheckPasswordHash(password, hash []byte) bool {
	err := bcrypt.CompareHashAndPassword(hash, password)
	return err == nil
}

// ฟังก์ชันสำหรับการเข้ารหัสข้อมูลบัตรเครดิต
func EncryptCreditCard(creditCardNumber string, key string) (string, error) {
	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	// สร้าง IV (Initialization Vector)
	ciphertext := make([]byte, aes.BlockSize+len(creditCardNumber))
	iv := ciphertext[:aes.BlockSize]

	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(creditCardNumber))

	// คืนค่าข้อมูลบัตรที่เข้ารหัสในรูปแบบ hex
	return hex.EncodeToString(ciphertext), nil
}

// ฟังก์ชันสำหรับการถอดรหัสข้อมูลบัตรเครดิต
func DecryptCreditCard(encryptedCreditCard string, key string) (string, error) {
	ciphertext, _ := hex.DecodeString(encryptedCreditCard)

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(ciphertext, ciphertext)

	// คืนค่าบัตรเครดิตที่ถูกถอดรหัส
	return string(ciphertext), nil
}

// ฟังก์ชันสร้างแฮชจากหมายเลขบัตรเครดิต (ก่อนเข้ารหัส)
func HashedCreditCardNumber(creditCardNumber string) string {
	hash := sha256.Sum256([]byte(creditCardNumber))
	return hex.EncodeToString(hash[:])
}