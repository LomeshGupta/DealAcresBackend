const OTP = require("../models/otpModel");
const axios = require("axios");

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required." });
  }

  // Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiresAt = Date.now() + 3 * 60 * 1000; // OTP expires in 3 minutes

  try {
    // Save OTP to the database
    const otpRecord = new OTP({ phone, otp, expiresAt });
    await otpRecord.save();

    // Log OTP record
    console.log("OTP Record Saved:", otpRecord);

    // Prepare API payload
    const payload = {
      messages: [
        {
          to: `+91${phone}`, // Ensure phone number is correctly formatted with country code
          content: {
            templateName: "otp_verification",
            language: "en",
            templateData: {
              body: { placeholders: [String(otp)] },
              buttons: [{ type: "URL", parameter: String(otp) }],
            },
          },
        },
      ],
    };

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: "key_tLislObyww", // Replace with your API key
    };

    // Log payload and headers
    console.log("Request Payload:", JSON.stringify(payload, null, 2));
    console.log("Request Headers:", JSON.stringify(headers, null, 2));

    // Send OTP via API
    const response = await axios.post(
      "https://public.doubletick.io/whatsapp/message/template",
      JSON.stringify(payload),
      { headers }
    );

    // Log the API response
    console.log("API Response:", response.data);

    // Return success message
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);

    // Log additional error details if available
    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Headers:", error.response.headers);
      console.error("Error Response Data:", error.response.data);
    }

    // Return error response
    return res.status(500).json({ error: "Failed to send OTP." });
  }
};

exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res
      .status(400)
      .json({ error: "Phone number and OTP are required." });
  }

  try {
    // Find the latest OTP record for the phone number, sorted by creation date (descending)
    const otpRecord = await OTP.findOne({ phone }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(404).json({ error: "OTP record not found." });
    }

    // Check if OTP has expired
    if (Date.now() > otpRecord.expiresAt) {
      return res.status(400).json({ error: "OTP has expired." });
    }

    // Check if OTP matches
    if (String(otpRecord.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({
        error: `Invalid OTP. Stored OTP: ${otpRecord.otp}, Provided OTP: ${otp}`,
      });
    }

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    return res.status(500).json({ error: "Failed to verify OTP." });
  }
};
