import mongoose from 'mongoose'
const Schema = mongoose.Schema

export const BugSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: Number, required: true, min: 1, max: 5 },
  closed: { type: Boolean, default: false },
  closedDate: { type: Date },
  creatorId: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
  tracked: { type: Boolean, default: false }

},
{
  timestamps: true,
  toJSON: { virtuals: true }
})

BugSchema.virtual('creator', {
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true,
  ref: 'Account'
})
