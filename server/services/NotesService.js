import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class NotesService {
  async getNoteById(noteId) {
    const note = await dbContext.Note.findById(noteId).populate('creator', 'name picture')
    if (!note) {
      throw new BadRequest('Note ID does not Exist')
    }
    return note
  }

  async deleteNote(noteId, id) {
    const note = await this.getNoteById(noteId)
    if (id !== note.creatorId.toString()) {
      throw new Forbidden('Not Authorized to Delete')
    }
    await note.remove()
    return note
  }

  async createNote(noteData) {
    const note = await dbContext.Note.create(noteData)
    await note.populate('creator', 'name picture')
    return note
  }

  async getNotes(bugId) {
    const notes = await dbContext.Note.find(bugId).populate('creator', 'name picture')
    if (!notes) {
      throw new BadRequest('No Notes for this BugID')
    }
    return notes
  }

  async getAllNotes(query) {
    const notes = await dbContext.Note.find(query).populate('creator', 'name picture')
    if (!notes) {
      throw new BadRequest('No Notes')
    }
    return notes
  }
}
export const notesService = new NotesService()
