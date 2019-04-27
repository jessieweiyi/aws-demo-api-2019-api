import AWSServiceFactory from '../../services/awsServiceFactory';

function queryJob(req, res, next) {
  const dbService = AWSServiceFactory.getDBService();
  const { jobId } = req.params;
  return dbService.getJob(jobId)
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(204);
      }
    })
    .catch(error => {
      logger.error(error);
      res.status(500);
    })
    .then(next);
}

module.exports = queryJob;
