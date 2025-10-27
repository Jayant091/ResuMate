import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Resume',
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
resumeSchema.index({ userId: 1, updatedAt: -1 });

// Ensure user can only access their own resumes
resumeSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

export default mongoose.model('Resume', resumeSchema);



