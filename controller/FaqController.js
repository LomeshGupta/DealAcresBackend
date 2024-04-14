const FAQ = require('../models/FaqModel');

const createFAQ = async (req, res) => {
    try {
        const faq = new FAQ(req.body);
        await faq.save();
        res.status(201).send(faq);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({});
        res.send(faqs);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).send();
        }
        res.send(faq);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateFAQById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['question', 'answer'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!faq) {
            return res.status(404).send();
        }
        res.send(faq);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (!faq) {
            return res.status(404).send();
        }
        res.send(faq);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createFAQ,
    getAllFAQs,
    getFAQById,
    updateFAQById,
    deleteFAQById
};
