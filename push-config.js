/* ===== ตั้งค่าการแจ้งเตือน (Firebase) — ผู้ดูแลระบบวางค่าจาก Firebase Console ตามคู่มือ =====
 * ค่าชุดนี้ไม่ใช่ความลับ (เป็นค่าที่หน้าเว็บทุกเว็บที่ใช้ Firebase ต้องเปิดเผย)
 * ยังไม่ได้ใส่ = แอปทำงานปกติ แค่ยังไม่มีปุ่มเปิดการแจ้งเตือน */
var PUSH_CONFIG = {
  apiKey: 'AIzaSyAv-bFBIiyq6MX8c1MSsSe96fZF2JNb71M',
  authDomain: 'bungba-app.firebaseapp.com',
  projectId: 'bungba-app',
  messagingSenderId: '211371582941',
  appId: '1:211371582941:web:d889ce6799c7dcc5ab4234',
  vapidKey: 'BELT-RQjwo8bzCP4XfYKvib28CNm_Ys09o6tk2-bznJUu_I2pqM4vtnf_a19oGixsFuo2gvLB2XpZLYbkKh3ljg'   // Cloud Messaging → Web Push certificates → Key pair
};
