import { connectToDB } from '@mongodb';
import PcCoiThi from '@models/PcCoiThi';

export const GET = async (req) => {
  try {
    await connectToDB();

    // Lấy các tham số từ query
    const { searchParams } = new URL(req.url);
    const namHoc = searchParams.get('namHoc');
    const loaiKyThi = searchParams.get('loaiKyThi');
    const loai = searchParams.get('loai');
    const hocKy = searchParams.get('hocKy');

    // Tạo đối tượng điều kiện tìm kiếm
    let filter = {};

    // Nếu có tham số namHoc, thêm vào điều kiện tìm kiếm
   
    // Nếu có tham số loaiKyThi, thêm vào điều kiện tìm kiếm
    if (loaiKyThi) {
      filter.loaiKyThi = loaiKyThi;
    }
    if (namHoc) {
      filter.namHoc = namHoc;
    }

    if (loai) {
      filter.loaiDaoTao = loai;
    }
    if (hocKy && hocKy !== 'null'&& hocKy !== 'undefined') {
      filter.ky = hocKy;
    }

    // Tìm kiếm các bản ghi phân công giảng dạy theo điều kiện filter
    const assignments = await PcCoiThi.find(filter);

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(assignments), { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Lỗi khi lấy danh sách phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};


export const POST = async (req) => {
  try {
    await connectToDB();

    // Lấy dữ liệu từ request
    const data = await req.json();
    console.log('da',data)

    // Kiểm tra xem dữ liệu có hợp lệ không
    const { hocPhan, lop, ngayThi, namHoc, loaiKyThi } = data;
    if (!hocPhan || !lop || !ngayThi || !namHoc || !loaiKyThi) {
      return new Response(JSON.stringify({ message: "Dữ liệu không hợp lệ, vui lòng điền đầy đủ các trường bắt buộc." }), { status: 400 });
    }

    // Tạo một bản ghi mới cho Phân Công Giảng Dạy
    const newAssignment = new PcCoiThi({
      hocPhan,
      lop: data.lop,
      // hocPhan: Array.isArray(hocPhan) ? hocPhan : [hocPhan],
      // lop: Array.isArray(lop) ? lop : [lop],
      ngayThi,
      ca: data.ca || 0,
      cbo1: data.cbo1 || '',
      cbo2: data.cbo2 || '',
      thoiGian: data.thoiGian,
      diaDiem: data.diaDiem || '',
      ghiChu: data.ghiChu || '',
      phong:data.phong,
      namHoc,
      loaiKyThi:data.loaiKyThi,
      loaiDaoTao: data.loai || "",
      hinhThuc: data.hinhThuc,
      ky: data.hocKy
    });

    // Lưu bản ghi mới vào database
    await newAssignment.save();

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(newAssignment), { status: 201 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Lỗi khi thêm mới bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    await connectToDB();

    // Lấy dữ liệu và ID từ request
    const { id, ...data } = await req.json();

    // Kiểm tra xem ID có tồn tại không
    if (!id) {
      return new Response(JSON.stringify({ message: "ID bản ghi không được cung cấp." }), { status: 400 });
    }

    // Cập nhật bản ghi dựa trên ID
    const updatedAssignment = await PcCoiThi.findByIdAndUpdate(id, data, { new: true });

    if (!updatedAssignment) {
      return new Response(JSON.stringify({ message: "Không tìm thấy bản ghi để cập nhật." }), { status: 404 });
    }

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(updatedAssignment), { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Lỗi khi cập nhật bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await connectToDB();

    // Lấy ID từ request body
    const { id } = await req.json();

    // Kiểm tra xem ID có tồn tại không
    if (!id) {
      return new Response(JSON.stringify({ message: "ID bản ghi không được cung cấp." }), { status: 400 });
    }

    // Xóa bản ghi dựa trên ID
    const deletedAssignment = await PcCoiThi.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return new Response(JSON.stringify({ message: "Không tìm thấy bản ghi để xóa." }), { status: 404 });
    }

    // Trả về phản hồi thành công
    return new Response(JSON.stringify({ message: "Bản ghi đã được xóa thành công." }), { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Lỗi khi xóa bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};