// controllers/testimonialController.js
const XLSX = require("xlsx");
const Testimonial = require("../models/testimonialsModel");

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a testimonial by ID
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(updatedTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a testimonial by ID
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    if (!deletedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//deleteAll
exports.deleteAllTestimonials = async (req, res) => {
  try {
    await Testimonial.deleteMany({});
    res.status(200).json({ message: "All services deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting services" });
  }
};

// Excel uploader within the same controller
exports.uploadExcel = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const testimonials = data.map((item) => ({
      img: item.img,
      name: item.name,
      role: item.role,
      content: item.content,
    }));

    await Testimonial.insertMany(testimonials);

    res.json({
      message: `${testimonials.length} testimonials uploaded successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
