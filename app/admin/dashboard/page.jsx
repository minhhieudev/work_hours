'use client';
import React, { useState, useEffect } from "react";
import { Table, Select, Progress, Input } from "antd";
import {
    CheckCircleOutlined,
    CalendarOutlined,
    FileOutlined, // Thay đổi icon
} from "@ant-design/icons";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from "react-hot-toast";

const { Option } = Select;
const { Search } = Input;

const Dashboard = () => {
    const dataSource = [
        { key: "1", username: "Nguyễn Quốc Dũng", khoa: "Kỹ thuật - Công nghệ", soBuoiCoiThi: 32, soBuoiChamThi: 12 },
        { key: "2", username: "Trần Xuân Hiệp", khoa: "Ngoại ngữ", soBuoiCoiThi: 28, soBuoiChamThi: 10 },
        { key: "3", username: "Nguyễn Thị Trang", khoa: "Xã hội nhân văn", soBuoiCoiThi: 20, soBuoiChamThi: 8 },
        { key: "4", username: "Đinh Thị Như Quỳnh", khoa: "Nông nghiệp", soBuoiCoiThi: 27, soBuoiChamThi: 8 },
        { key: "5", username: "Đỗ Thị Phương Uyên", khoa: "Mầm non", soBuoiCoiThi: 12, soBuoiChamThi: 7 },
    ];

    const columns = [
        { title: "Họ tên giảng viên", dataIndex: "username", key: "username", render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span> },
        { title: "Số buổi coi thi", dataIndex: "soBuoiCoiThi", key: "soBuoiCoiThi", render: (text) => <span style={{ fontWeight: 'bold', color: 'green' }}>{text}</span> },
        { title: "Số buổi chấm thi", dataIndex: "soBuoiChamThi", key: "soBuoiChamThi", render: (text) => <span style={{ fontWeight: 'bold', color: 'red' }}>{text}</span> }
    ];

    const [selectedKhoa, setSelectedKhoa] = useState(null);
    const [filteredData, setFilteredData] = useState(dataSource);
    const [khoaList, setKhoaList] = useState([]);
    const [pageSize, setPageSize] = useState(5); // Số dòng hiển thị mặc định

    const fetchKhoaData = async () => {
        try {
            const res = await fetch(`/api/admin/khoa`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setKhoaList(data);
            } else {
                toast.error("Failed to fetch khoa data");
            }
        } catch (err) {
            toast.error("An error occurred while fetching khoa data");
        }
    };

    useEffect(() => {
        fetchKhoaData();
    }, []);

    const handleSelectKhoa = (khoa) => {
        setSelectedKhoa(khoa);
        if (khoa) {
            setFilteredData(dataSource.filter(item => item.khoa === khoa));
        } else {
            setFilteredData(dataSource);
        }
    };

    const handleSearch = (value) => {
        const searchValue = value.toLowerCase();
        setFilteredData(dataSource.filter(item =>
            item.username.toLowerCase().includes(searchValue) &&
            (!selectedKhoa || item.khoa === selectedKhoa)
        ));
    };

    return (
        <div className="py-4 px-0 h-[90vh]">
            <div className="grid grid-cols-3 gap-6 mb-3 ">
                <div className="bg-white p-4 rounded-lg shadow-xl flex items-center">
                    <CalendarOutlined style={{ fontSize: "90px" }} className="mr-4 text-blue-500" />
                    <div className="font-bold">
                        <div className="flex gap-3">
                            <p>Năm học: </p>
                            <h2 className="text-xl font-bold mb-2">
                                <Select defaultValue={"2023-2024"} style={{ width: 120 }} allowClear>
                                    {["2021-2022", "2022-2023", "2023-2024", "2024-2025"].map((nam, index) => (
                                        <Option key={index} value={nam}>
                                            {nam}
                                        </Option>
                                    ))}
                                </Select>
                            </h2>
                        </div>
                        <div className="flex gap-3">
                            <p>Học kỳ: </p>
                            <h2 className="text-xl font-bold mb-2">
                                <Select defaultValue={"1"} style={{ width: 120 }} allowClear>
                                    {["1", "2"].map((nam, index) => (
                                        <Option key={index} value={nam}>
                                            {nam}
                                        </Option>
                                    ))}
                                </Select>
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-xl flex items-center justify-between">
                    <div className="flex items-center">
                        <CheckCircleOutlined style={{ fontSize: "90px" }} className="mr-4 text-green-500" />
                        <div>
                            <h2 className="text-xl font-bold mb-2">55 Học phần</h2>
                            <p>Đã hoàn thành</p>
                        </div>
                    </div>
                    <Progress
                        type="dashboard"
                        steps={8}
                        percent={50}
                        trailColor="rgba(0, 0, 0, 0.06)"
                        strokeWidth={20}
                    />
                </div>

                <div className="bg-white p-4 rounded-lg shadow-xl flex items-center justify-between">
                    <div className="flex items-center">
                        <FileOutlined style={{ fontSize: "90px" }} className="mr-4 text-purple-500" /> {/* Đổi icon */}
                        <div>
                            <h2 className="text-xl font-bold mb-2">40 Bài thi</h2>
                            <p>Đã chấm</p>
                        </div>
                    </div>
                    <Progress
                        type="dashboard"
                        steps={10}
                        percent={50}
                        trailColor="rgba(0, 0, 0, 0.06)"
                        strokeWidth={20}
                    />
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4 h-[66vh]">
                <div className="col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Biểu đồ</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="username" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="soBuoiCoiThi" fill="#82ca9d" name="Số buổi coi thi" />
                            <Bar dataKey="soBuoiChamThi" fill="#ff6347" name="Số bài đã chấm" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="col-span-2 bg-white p-6 rounded-lg shadow-md ">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-bold">Danh sách</h2>
                        <div className="flex space-x-4 w-[70%]">
                            <Select
                                placeholder="Chọn khoa"
                                style={{ width: 200 }}
                                value={selectedKhoa}
                                onChange={handleSelectKhoa}
                                allowClear
                            >
                                {khoaList.map((khoa, index) => (
                                    <Option key={index} value={khoa.tenKhoa}>
                                        {khoa.tenKhoa}
                                    </Option>
                                ))}
                            </Select>
                            <Search
                                placeholder="Tìm kiếm"
                                allowClear
                                enterButton="Search"
                                size="small"
                                style={{ width: 250 }}
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Select
                                value={pageSize}
                                defaultValue={5}
                                style={{ width: 100 }}
                                onChange={(value) => setPageSize(value)}
                            >
                                {[5, 10, 15, 20].map((size) => (
                                    <Option key={size} value={size}>
                                        {size}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}> {/* Thêm scroll */}
                        <Table columns={columns} dataSource={filteredData} pagination={{ pageSize }} rowKey="key" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
