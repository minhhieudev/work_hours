import PhongThi from "@models/PhongThi"; // Import mô hình PhongThi
import { connectToDB } from "@mongodb";

// Lưu mô hình vào biến
const PhongThiModel = PhongThi;

export const GET = async (req, res) => {
  try {
    await connectToDB();

    // Sử dụng biến PhongThiModel để truy vấn dữ liệu
    const allPhongThi = await PhongThiModel.find();

    return new Response(JSON.stringify(allPhongThi), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get all PhongThi", { status: 500 });
  }
};

export const POST = async (req, res) => {
  try {
    await connectToDB();
    const { tenPhong, soCho } = await req.json();

    // Kiểm tra phòng thi có tồn tại không, nếu có thì cập nhật, nếu không thì tạo mới
    let existingPhongThi = await PhongThiModel.findOne({ tenPhong });

    if (existingPhongThi) {
      existingPhongThi.soCho = soCho;
      await existingPhongThi.save();

      return new Response(JSON.stringify(existingPhongThi), { status: 200 });
    } else {
      const newPhongThi = new PhongThiModel({
        tenPhong,
        soCho,
      });

      await newPhongThi.save();
      return new Response(JSON.stringify(newPhongThi), { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return new Response("Failed to create or update PhongThi", { status: 500 });
  }
};

export const PUT = async (req, res) => {
  try {
    await connectToDB();
    const { id, tenPhong, soCho } = await req.json();

    const phongThiToUpdate = await PhongThiModel.findById(id);

    if (!phongThiToUpdate) {
      return new Response("PhongThi not found", { status: 404 });
    }

    phongThiToUpdate.tenPhong = tenPhong;
    phongThiToUpdate.soCho = soCho;

    await phongThiToUpdate.save();

    return new Response(JSON.stringify(phongThiToUpdate), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update PhongThi", { status: 500 });
  }
};

export const DELETE = async (req, res) => {
  try {
    await connectToDB();
    const { id } = await req.json();

    const phongThiToDelete = await PhongThiModel.findByIdAndDelete(id);

    if (!phongThiToDelete) {
      return new Response("PhongThi not found", { status: 404 });
    }

    return new Response("PhongThi deleted successfully", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to delete PhongThi", { status: 500 });
  }
};