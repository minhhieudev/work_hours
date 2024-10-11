import User from "@models/User";
import { connectToDB } from "@mongodb";

export const POST = async (req) => {
  try {
    await connectToDB();

    // Lấy dữ liệu từ body của yêu cầu
    const { users } = await req.json();

    console.log("Dữ liệu nhận được:", users);

    if (!users || !Array.isArray(users)) {
      return new Response(JSON.stringify({ message: "Invalid data format" }), { status: 400 });
    }

    // Duyệt qua danh sách users và xử lý từng user
    const processedUsers = await Promise.all(
      users.map(async (user) => {
        const maGV = user[0];

        // Tìm và cập nhật nếu người dùng tồn tại, nếu không thì tạo mới
        const updatedUser = await User.findOneAndUpdate(
          { maGV },
          {
            username: user[1], // Cập nhật các trường thông tin
            khoa: user[2],
            email: `${maGV}@gmail.com`
          },
          { new: true, upsert: true } // Nếu không tìm thấy thì tạo mới
        );

        return updatedUser;
      })
    );

    // Trả về danh sách người dùng đã xử lý
    return new Response(JSON.stringify(processedUsers), { status: 201 });

  } catch (err) {
    console.error("Lỗi khi xử lý yêu cầu:", err);
    return new Response(JSON.stringify({ message: "Failed to process users" }), { status: 500 });
  }
};
