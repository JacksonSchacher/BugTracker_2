import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'
import { logger } from '../utils/Logger'

class TrackedBugsService {
  async getTrackedBugsByAccount(creatorId) {
    const bugs = await dbContext.TrackedBug.find(creatorId).populate('tracker', 'name picture').populate('bug')
    if (!bugs) {
      throw new BadRequest('No Tracked Bugs for this User')
    }
    return bugs
  }

  async createTrackedBug(trackedBugData) {
    const foundBug = await dbContext.TrackedBug.find({ bugId: trackedBugData.bugId })
    if (foundBug.length) {
      logger.log('createTrackedBug', foundBug)
      throw new BadRequest('TrackedBug already exists in Database')
    }
    const bug = await dbContext.TrackedBug.create(trackedBugData)
    await bug.populate('bug')
    await bug.populate('tracker', 'name picture')
    return bug
  }

  async deleteTrackedBug(trackedBugId, id) {
    const bug = await this.getTrackedBugById(trackedBugId)
    if (id !== bug.accountId.toString()) {
      throw new Forbidden('Not Authorized to Delete Tracked Bug')
    }
    await bug.remove()
    return bug
  }

  async getTrackedBugById(trackedBugId) {
    const bug = await dbContext.TrackedBug.findById(trackedBugId).populate('tracker', 'picture name')
    if (!bug) {
      throw new BadRequest('Tracked Bug ID does not Exist')
    }
    return bug
  }

  async getTrackedBugs(bugId) {
    const bugs = await dbContext.TrackedBug.find(bugId).populate('tracker', 'name picture').populate('bug')
    if (!bugs) {
      throw new BadRequest('No Tracked Bugs for this ID')
    }
    return bugs
  }
}
export const trackedBugsService = new TrackedBugsService()
