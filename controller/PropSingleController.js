const PropSingle = require('../models/PropertySingle');
const xlsx = require('xlsx');

exports.uploadExcel = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Please upload an Excel file' });
        }

        // Read the Excel file from the buffer
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheet_name_list = workbook.SheetNames;
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        const projects = data.map(item => ({
            images: item.images ? item.images.split(',') : [],
            floorPlan: item.floorPlan,
            status: item.status,
            title: item.title,
            location: {
                locality: item.locality,
                city: item.city
            },
            price: item.price,
            aboutProject: item.aboutProject,
            projectArea: item.projectArea,
            sizes: item.sizes,
            projectSize: item.projectSize,
            launchDate: new Date(item.launchDate),
            avgPrice: item.avgPrice,
            possessionStatus: item.possessionStatus,
            configuration: item.configuration,
            address: item.address,
            specification: item.specification,
            amenities: item.amenities,
            aboutDeveloper: item.aboutDeveloper,
            localityOverview: item.localityOverview
        }));

        await PropSingle.insertMany(projects);

        res.status(201).json({ message: 'Projects uploaded successfully', projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create a new project
exports.createProject = async (req, res) => {
    try {
        const newProject = new PropSingle(req.body);
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await PropSingle.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await PropSingle.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
    try {
        const updatedProject = await PropSingle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
    try {
        const deletedProject = await PropSingle.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
