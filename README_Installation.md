# วิธีการติดตั้งและรันระบบ TECHGEN SHOP

เอกสารนี้อธิบายขั้นตอนการติดตั้งและการใช้งานระบบ

---

## 1. โปรแกรมที่ต้องติดตั้งก่อน

ก่อนใช้งานระบบ ต้องติดตั้งโปรแกรมต่อไปนี้

- Node.js
- MongoDB Compass (ใช้จัดการฐานข้อมูล MongoDB)
- Git
- Web Browser เช่น Google Chrome



## 2. ดาวน์โหลดโปรเจค

Clone โปรเจคจาก GitHub

git clone <repository-url>

จากนั้นเข้าไปในโฟลเดอร์โปรเจค

cd LAB12



## 3. ติดตั้ง Dependencies

โปรเจคนี้ใช้ Node.js libraries หลายตัว เช่น

- express
- ejs
- mongoose
- multer
- express-session
- bcrypt
- nodemon

ติดตั้งทั้งหมดด้วยคำสั่ง

npm install

คำสั่งนี้จะติดตั้ง package ทั้งหมดที่อยู่ในไฟล์ package.json



## 4. ฐานข้อมูล

ระบบใช้ฐานข้อมูล **MongoDB**

สามารถใช้งานผ่านโปรแกรม

MongoDB Compass

Database ที่ใช้ในระบบ 

mongodb://localhost:27017/TECHGENSHOP



## 5. การรันโปรเจค

เปิด Terminal ในโฟลเดอร์โปรเจค แล้วพิมพ์คำสั่ง

npm start

ระบบจะทำงานผ่าน nodemon และเริ่ม server อัตโนมัติ



## 6. เข้าใช้งานระบบ

เปิด Web Browser แล้วเข้า

http://localhost:8080



## 7. หมายเหตุ

- ต้องเปิด MongoDB ก่อนรันระบบ
- ต้องใช้คำสั่ง **npm install** ก่อนใช้งานครั้งแรก
- โฟลเดอร์ **node_modules** จะไม่ถูก upload ไปที่ Git