import Subject from '../models/subject.model.js';
import Student from '../models/student.model.js';
import mongoose from 'mongoose';


// Create new subject
export const createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await Subject.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Subject already exists' });

    const newSubject = new Subject({ name });
    await newSubject.save();

    res.status(201).json(newSubject);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create subject', error: err.message });
  }
};

// Get all subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({}, '_id name');
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: err.message });
  }
};

// Delete subject
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const deleted = await Subject.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    await Student.updateMany(
      { subjects: id },
      { $pull: { subjects: id } }
    );

    res.status(200).json({ message: 'Subject deleted', deleted });
  } catch (err) {
    console.error('Delete subject error:', err);
    res.status(500).json({ message: 'Failed to delete subject', error: err.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    const { name } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check for name conflict
    const existing = await Subject.findOne({ name: name.trim(), _id: { $ne: subjectId } });
    if (existing) {
      return res.status(409).json({ message: 'Another subject with the same name already exists' });
    }

    // Perform update
    subject.name = name.trim();
    await subject.save();

    res.status(200).json({ message: 'Subject updated successfully', subject });
  } catch (err) {
    console.error('Update subject error:', err);
    res.status(500).json({ message: 'Failed to update subject', error: err.message });
  }
};
