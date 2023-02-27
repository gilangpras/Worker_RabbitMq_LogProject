import mongoose from 'mongoose'
const { Schema } = mongoose

const LogShowProject = new Schema({
  projectId: {
    type: String
  },
  projectName: {
    type: String
  },
  author: {
    type: String
  },
  phoneNumber_author: {
    type: String
  },
  status: {
    type: String
  },
  message: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('log-show-project', LogShowProject)
