require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { db } = require('./firebase');

app.use(cors());

app.use(express.json());

const projectId = process.env.GOOGLE_PROJECT_ID;
const privateKeyId = process.env.GOOGLE_PRIVATE_KEY_ID;
const privateKey = process.env.GOOGLE_PRIVATE_KEY;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const clientId = process.env.GOOGLE_CLIENT_ID;
const authUri = process.env.GOOGLE_AUTH_URI;
const tokenUri = process.env.GOOGLE_TOKEN_URI;
const authProviderCertUrl = process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL;
const clientCertUrl = process.env.GOOGLE_CLIENT_X509_CERT_URL;
const universeDomain = process.env.GOOGLE_UNIVERSE_DOMAIN;

console.log('Project ID:', projectId);
console.log('Client Email:', clientEmail);

app.get('/', async (req, res) => {
  res.json('Hello World!');
});

// Register A Vendor API Endpoint
app.get(
  '/register/vendorname=:vendorname/vendoremail=:vendoremail/vendorphone=:vendorphone/businessname=:businessname/businesstype=:businesstype/gstno=:gstno/businessregno=:businessregno/logolink=:logolink/address=:address/state=:state/city=:city/pincode=:pincode',
  async (req, res) => {
    try {
      const {
        vendorname,
        vendoremail,
        vendorphone,
        businessname,
        businesstype,
        gstno,
        businessregno,
        logolink,
        address,
        state,
        city,
        pincode,
      } = req.params;

      if (
        !vendorname ||
        !vendoremail ||
        !vendorphone ||
        !businessname ||
        !businesstype ||
        !gstno ||
        !businessregno ||
        !logolink ||
        !address ||
        !state ||
        !city ||
        !pincode
      ) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required. Please provide valid input.',
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(vendoremail)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format.',
        });
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(vendorphone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number. It must be 10 digits.',
        });
      }

      const vendorRef = db.collection('Registered-Vendors').doc(vendoremail);
      const existingVendor = await vendorRef.get();
      if (existingVendor.exists) {
        return res.status(401).json({
          success: false,
          message: 'Vendor with this email is already registered.',
        });
      }

      const registeredVendor = {
        Name: vendorname,
        Email: vendoremail,
        Phone: vendorphone,
        BusinessName: businessname,
        BusinessType: businesstype,
        GSTNo: gstno,
        BusinessRegNo: businessregno,
        LogoLink: logolink,
        Address: address,
        State: state,
        City: city,
        Pincode: pincode,
      };

      await vendorRef.set(registeredVendor);

      res.status(200).json({
        success: true,
        message: 'Vendor registered successfully.',
        vendor: registeredVendor,
      });
    } catch (error) {
      console.error('Error registering vendor:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message,
      });
    }
  }
);

//Delete Business API Endpoint.

app.get('/deletebusiness/vendoremail=:vendoremail', async (req, res) => {
  try {
    const { vendoremail } = req.params;

    if (!vendoremail) {
      return res.status(400).json({
        success: false,
        message: 'Vendor email is required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(vendoremail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      });
    }

    const vendorRef = db.collection('Registered-Vendors').doc(vendoremail);
    const existingVendor = await vendorRef.get();
    if (!existingVendor.exists) {
      return res.status(404).json({
        success: false,
        message:
          'Vendor not found. No business exists with the provided email.',
      });
    }

    await vendorRef.delete();

    res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({
      success: false,
      message:
        'An unexpected error occurred while deleting the vendor. Please try again later.',
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
