const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Trip = require('./models/tripModel');
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require('./routes/tripRoutes');
const cors = require('cors');
require("dotenv").config(); // Nạp biến môi trường từ .env


// // Kết nối đến cơ sở dữ liệu MongoDB
// mongoose.connect('mongodb://localhost:27017/Apiflutter', {
//     // Các tùy chọn lỗi thời đã được loại bỏ
//   })
//   .then(() => {
//     console.log('Kết nối đến cơ sở dữ liệu MongoDB thành công.');
//   })
//   .catch(err => {
//     console.error('Lỗi kết nối đến cơ sở dữ liệu MongoDB:', err);
//   });

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình route
app.use("/api", tripRoutes);
app.use("/api/users", userRoutes);

// Cấu hình đường dẫn tới thư mục chứa tài nguyên tĩnh (images, css, js,...)
app.use(
    "/resource/images",
    express.static(path.join(__dirname, "resource", "images"))
);

// Kiểm tra biến môi trường Mongo URI
const mongoUri = process.env.MONGO_URI; // Lấy URI từ biến môi trường

if (!mongoUri) {
    console.error("Lỗi: MONGO_URI không được định nghĩa trong file .env");
    process.exit(1); // Dừng server nếu thiếu URI
}

// Kết nối MongoDB Atlas (sử dụng `mongoose.connect` một lần duy nhất)
mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("Đã kết nối MongoDB");
        processDatabase(); // Gọi hàm sau khi kết nối thành công
    })
    .catch((err) => {
        console.error("Không thể kết nối MongoDB", err);
        process.exit(1); // Dừng server nếu lỗi kết nối
    });

// Hàm xử lý dữ liệu
const processDatabase = async () => {
    try {
        const trips = await Trip.find(); // Sử dụng model Trip để lấy dữ liệu
        console.log("Kết nối thành công và lấy dữ liệu trips", trips);
    } catch (err) {
        console.error("Lỗi khi xử lý dữ liệu:", err);
    }
};

// Cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
