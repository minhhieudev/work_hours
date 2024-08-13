import mongoose from "mongoose";
import { connectToDB } from "@mongodb";
import CongTacGiangDay from "@models/CongTacGiangDay";
import BoiDuong from "@models/BoiDuong";
import CongTacChamThi from "@models/CongTacChamThi";
import CongTacCoiThi from "@models/CongTacCoiThi";
import CongTacHuongDan from "@models/CongTacHuongDan";
import CongTacKiemNhiem from "@models/CongTacKiemNhiem";
import CongTacRaDe from "@models/CongTacRaDe";

const models = {
  CongTacGiangDay,
  BoiDuong,
  CongTacChamThi,
  CongTacCoiThi,
  CongTacHuongDan,
  CongTacKiemNhiem,
  CongTacRaDe,
};

export const POST = async (req, { params }) => {
  try {
    const { form } = params;
    if (!models[form]) {
      return new Response("Invalid form name", { status: 400 });
    }

    await connectToDB();
    const body = await req.json();
    console.log(body)

    const model = models[form];
    const newRecord = await model.create(body);
    return new Response(JSON.stringify(newRecord), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(`Failed to create new ${form} record`, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  try {
    const { form } = params;

    if (!models[form]) {
      return new Response("Invalid form name", { status: 400 });
    }

    await connectToDB();
    const body = await req.json();
    const { id, ...updateData } = body;
    const model = models[form];
    const updatedRecord = await model.findByIdAndUpdate(id, updateData, { new: true });
    return new Response(JSON.stringify(updatedRecord), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(`Failed to update ${form} record`, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const { form } = params;

    if (!models[form]) {
      return new Response("Invalid form name", { status: 400 });
    }

    await connectToDB();
    const { id } = await req.json();
    const model = models[form];
    await model.findByIdAndDelete(id);
    return new Response(`${form} record deleted successfully`, { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(`Failed to delete ${form} record`, { status: 500 });
  }
};

export const GET = async (req, { params }) => {
  try {
    const { form } = params;

    if (!models[form]) {
      return new Response("Invalid form name", { status: 400 });
    }

    await connectToDB();
    const url = new URL(req.url, `http://${req.headers.host}`);
    const user = url.searchParams.get('user');
    const type = url.searchParams.get('type'); 

    if (!user) {
      return new Response("User parameter is required", { status: 400 });
    }

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);
    const model = models[form];
    
    const query = {
      user: user,
      type:type,
      createdAt: { $gte: startOfYear, $lt: endOfYear }
    };

    const records = await model.find(query);

    return new Response(JSON.stringify(records), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(`Failed to retrieve ${form} records`, { status: 500 });
  }
};

