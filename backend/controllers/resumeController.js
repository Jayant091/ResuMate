import Resume from '../models/Resume.js';

export const createResume = async (req, res) => {
  try {
    const { resumeData, title } = req.body;
    const userId = req.user._id;

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    const resume = new Resume({
      userId,
      resumeData,
      title: title || 'Untitled Resume'
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume created successfully',
      resume: {
        id: resume._id,
        title: resume.title,
        resumeData: resume.resumeData,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Server error creating resume' });
  }
};

export const listResumes = async (req, res) => {
  try {
    const userId = req.user._id;

    const resumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .select('-resumeData') // Don't send full data in list view
      .lean();

    res.json({
      resumes: resumes.map(resume => ({
        id: resume._id,
        title: resume.title,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }))
    });
  } catch (error) {
    console.error('List resumes error:', error);
    res.status(500).json({ error: 'Server error fetching resumes' });
  }
};

export const getResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.isOwnedBy(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      resume: {
        id: resume._id,
        title: resume.title,
        resumeData: resume.resumeData,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Server error fetching resume' });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { resumeData, title } = req.body;
    const userId = req.user._id;

    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.isOwnedBy(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update fields if provided
    if (resumeData !== undefined) {
      resume.resumeData = resumeData;
    }
    if (title !== undefined) {
      resume.title = title;
    }

    await resume.save();

    res.json({
      message: 'Resume updated successfully',
      resume: {
        id: resume._id,
        title: resume.title,
        resumeData: resume.resumeData,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Server error updating resume' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.isOwnedBy(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Resume.findByIdAndDelete(id);

    res.json({
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Server error deleting resume' });
  }
};



