const Locality = require('../models/localityModel');

// Controller functions
const createLocality = async (req, res) => {
    try {
        const locality = new Locality(req.body);
        await locality.save();
        res.status(201).send(locality);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllLocalities = async (req, res) => {
    try {
        const localities = await Locality.find({});
        res.send(localities);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getLocalityById = async (req, res) => {
    try {
        const locality = await Locality.findById(req.params.id);
        if (!locality) {
            return res.status(404).send();
        }
        res.send(locality);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateLocalityById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['state', 'city', 'zipCode', 'population', 'area', 'landmarks'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const locality = await Locality.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!locality) {
            return res.status(404).send();
        }
        res.send(locality);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteLocalityById = async (req, res) => {
    try {
        const locality = await Locality.findByIdAndDelete(req.params.id);
        if (!locality) {
            return res.status(404).send();
        }
        res.send(locality);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createLocality,
    getAllLocalities,
    getLocalityById,
    updateLocalityById,
    deleteLocalityById
};
