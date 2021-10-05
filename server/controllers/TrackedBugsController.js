import { Auth0Provider } from '@bcwdev/auth0provider'
import { trackedBugsService } from '../services/TrackedBugsService'
import BaseController from '../utils/BaseController'

export class TrackedBugsController extends BaseController {
  constructor() {
    super('api/trackedbugs')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createTrackedBug)
      .delete('/:trackedBugId', this.deleteTrackedBug)
  }

  async createTrackedBug(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const bug = await trackedBugsService.createTrackedBug(req.body)
      res.send(bug)
    } catch (error) {
      next(error)
    }
  }

  async deleteTrackedBug(req, res, next) {
    try {
      const bug = await trackedBugsService.deleteTrackedBug(req.params.trackedBugId, req.userInfo.id)
      res.send(bug)
    } catch (error) {
      next(error)
    }
  }
}
