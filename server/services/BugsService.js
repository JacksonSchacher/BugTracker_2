import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class BugsService {
  async deleteBug(bugId, id) {
    const bug = await this.getBugById(bugId)
    if (id !== bug.creatorId.toString()) {
      throw new Forbidden('Not Authorized to Delete')
    }
    if (bug.closed) {
      bug.closed = false
      bug.closedDate = ''
    } else {
      bug.closed = true
      bug.closedDate = new Date()
    }
    await bug.save()
    return bug
  }

  async editBug(bugId, id, bugData) {
    const bug = await this.getBugById(bugId)
    if (id !== bug.creatorId.toString()) {
      throw new Forbidden('Not Authorized to Edit')
    }
    if (bug.closed === true) {
      throw new Forbidden('Cannot Edit Closed Bug')
    }
    bug.title = bugData.title || bug.title
    bug.description = bugData.description || bug.description
    bug.priority = bugData.priority || bug.priority
    // bug.closed = bugData.closed || bug.closed NOTE handled in the soft delete
    // bug.closedDate = bugData.closedDate || bug.closedDate
    await bug.save()
    return bug
  }

  async createBug(bugData) {
    const bug = await dbContext.Bug.create(bugData)
    await bug.populate('creator', 'name picture')
    return bug
  }

  async getBugById(bugId) {
    const bug = await dbContext.Bug.findById(bugId).populate('creator', 'name picture')
    if (!bug) {
      throw new BadRequest('Bug ID does not exist')
    }
    return bug
  }

  async getBugs(query) {
    const bugs = await dbContext.Bug.find(query).sort('-createdAt').populate('creator', 'name picture')
    if (!bugs) {
      throw new BadRequest('No Bugs in Database')
    }
    return bugs
  }
}
export const bugsService = new BugsService()
