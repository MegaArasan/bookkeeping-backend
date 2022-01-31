import express from "express";
const router = express.Router();
import { client } from "../index.js";
import { ObjectId } from "mongodb";

router.route("/createinvoice").post(async (req, res) => {
  const data = req.body;
  const invoice = await client
    .db("bookkeeping")
    .collection("invoices")
    .insertOne(data);
  const invoices = await client
    .db("bookkeeping")
    .collection("invoices")
    .findOne(data);
  res.send(invoices);
  // console.log(invoices);
});
router.route("/getinvoice/:id").get(async (req, res) => {
  const id = req.params;
  const invoices = await client
    .db("bookkeeping")
    .collection("invoices")
    .findOne({ _id: ObjectId(id) });
  res.send(invoices);
});

router.route("/updateinvoice/:id").put(async (req, res) => {
  const id = req.params;
  // console.log(id);
  const data = req.body;
  delete data._id;
  // console.log(data);
  const invoice = await client
    .db("bookkeeping")
    .collection("invoices")
    .updateOne({ _id: ObjectId(id) }, { $set: data });
  const invoices = await client
    .db("bookkeeping")
    .collection("invoices")
    .findOne({ _id: ObjectId(id) });
  console.log(invoices);
  res.send(invoices);
});

router.route("/getall").get(async (req, res) => {
  const invoices = await client
    .db("bookkeeping")
    .collection("invoices")
    .find()
    .toArray();
  res.send(invoices);
});

router.route("/delete/:id").delete(async (req, res) => {
  const id = req.params;
  const invoices = await client
    .db("bookkeeping")
    .collection("invoices")
    .deleteOne({ _id: ObjectId(id) });
  res.status(200).send(invoices);
});

export const invoiceRouter = router;
