import express from "express";
const router = express.Router();
import { client } from "../index.js";
import { ObjectId } from "mongodb";
import pdf from "html-pdf";
import pdfTemplate from "../documents/index.js";

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
  // console.log(invoices);
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

router.route("/createanddownloadpdf").post((req, res) => {
  pdf.create(pdfTemplate(req.data), {}).toFile("Invoice.pdf", (err) => {
    if (err) {
      return promise.reject();
    }
    return promise.resolve();
  });
});
router.route("/fetch-pdf").get((req, res) => {
  res.sendFile(`${__dirname}/Invoice.pdf`);
});

router.route("/send-pdf").post((req, res) => {
  const data = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.my_gmail}`,
      pass: `${process.env.my_pass}`,
    },
  });

  const mailoptions = {
    from: data.company.businessName,
    to: data.email,
    subject: "Receipt of bill paym,ent",
    html: `
  <header><img src=${data.company.logo} alt="logo" style={{width:"100px"}} /></header>
  <h1>Hello ${data.name}</h1>
    <p>This mail for just remember you for the payment of bill.</p> 
    <p>your due amount is ${data.balanceDue}</p>
    <p>please pay the bill before or on deu date.</p>
    <p>Your due date is ${data.dueDate}</p>
  `,
    attachments: [
      {
        filename: "Invoice.pdf",
        path: __dirname + "Invoice.pdf",
        contentType: "application/pdf",
      },
    ],
  };

  transporter.sendMail(mailoptions, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + res.response);
    }
  });
  res.status(200).send({ Msg: "recovery mail sent" });
});
export const invoiceRouter = router;
