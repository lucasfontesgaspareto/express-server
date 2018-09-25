/**
 * Handles controller execution and responds to user (API Express version).
 * Web socket has a similar handler implementation.
 * @param promise Controller Promise. I.e. getUser.
 * @param params A function (req, res, next), all of which are optional
 * that maps our desired controller parameters. I.e. (req) => [req.params.username, ...].
 */
export const controllerHandler = (promise, params) => {
  return async (req, res, next) => {
    const boundParams = params ? params(req, res, next) : []
    try {
      const result = await promise(...boundParams)
      return res.json(result || { success: true })
    } catch (error) {
      return res.status(500) && next(error)
    }
  }
}