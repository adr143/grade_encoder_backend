import Grade from '../models/grades.model.js'
import mongoose from 'mongoose';

export const createSubjectGrade = async (studentId, subjectIds, sectionId, yearLevel) => {
  for (const subjectId of subjectIds) {
    const existing = await Grade.findOne({ student: studentId, subject: subjectId, section: sectionId });
    if(!existing){
      const grade = new Grade({
          student: studentId,
          subject: subjectId,
          section: sectionId,
          yearLevel: yearLevel
      })
      await grade.save()
    }
  }
}

export const deleteSubjectGrades = async (studentId, removedSubjectIds, sectionId) => {
  await Grade.deleteMany({
    student: studentId,
    subject: { $in: removedSubjectIds },
    section: sectionId
  });
};

export const getGradesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const grades = await Grade.find({ student: studentId })
      .populate('subject')
      .populate('section');
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get grades', error: err });
  }
};

// DELETE all grades for a student (if student is deleted)
export const deleteAllGradesForStudent = async (studentId) => {
  await Grade.deleteMany({ student: studentId });
};

export const getStudentGrades = async (req, res) => {
  const { studentId, sectionId, subjectId } = req.params;

  try {
    const grades = await Grade.find({
      student: studentId,
      section: sectionId,
      subject: subjectId
    }).populate('subject').populate('section');

    if (!grades || grades.length === 0) {
      return res.status(404).json({ message: 'Grades not found' });
    }

    res.status(200).json(grades);
  } catch (err) {
    console.error('Error fetching student grades:', err);
    res.status(500).json({ message: 'Failed to fetch grades', error: err });
  }
};

export const getGradesBySectionAndSubject = async (req, res) => {
  try {
    const { sectionId, subjectId } = req.params;

    console.log(sectionId);

    const grades = await Grade.find({ section: sectionId, subject: subjectId })
      .populate('student'); // Full student object

    console.log(grades);

    const result = grades.map((grade) => ({
      student: grade.student,
      grades: {
        prelimGrade: grade.prelimGrade,
        midtermGrade: grade.midtermGrade,
        finalGrade: grade.finalGrade,
        averageGrade: grade.averageGrade
      }
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getGradesBySectionAndSubject:", err);
    res.status(500).json({ message: 'Failed to get grades', error: err.message });
  }
};

export const batchUpdateGrades = async (req, res) => {
  try {
    const { sectionId, subjectId } = req.params;
    const { updates } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(sectionId) || !mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Invalid sectionId or subjectId.' });
    }

    // Validate update array
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty updates array.' });
    }

    for (const update of updates) {
      if (
        !mongoose.Types.ObjectId.isValid(update.studentId) ||
        typeof update.prelimGrade !== 'number' ||
        typeof update.midtermGrade !== 'number' ||
        typeof update.finalGrade !== 'number' ||
        typeof update.averageGrade !== 'string'
      ) {
        return res.status(400).json({ message: 'Invalid grade data in updates.' });
      }
    }

    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: {
          student: update.studentId,
          section: sectionId,
          subject: subjectId
        },
        update: {
          $set: {
            prelimGrade: update.prelimGrade,
            midtermGrade: update.midtermGrade,
            finalGrade: update.finalGrade,
            averageGrade: update.averageGrade
          }
        }
      }
    }));

    const result = await Grade.bulkWrite(bulkOps);

    res.status(200).json({
      message: 'Batch grade update successful',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Error in batchUpdateGrades:', err);
    res.status(500).json({ 
      message: 'Batch update failed', 
      error: process.env.NODE_ENV === 'development' ? err.stack : err.message 
    });
  }
};
