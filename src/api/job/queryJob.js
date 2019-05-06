import AWSServiceFactory from '../../services/awsServiceFactory';
import Logger from '../../utils/logger';

const logger = Logger.logger('routeQueryJob');

const queryJob = (req, res, next) => {
  const dbService = AWSServiceFactory.getDBService();
  const { jobId } = req.params;
  return dbService.getJob(jobId)
    .then(result => res.json(result))
    .catch((error) => {
      logger.error(error);
      res.status(500);
    })
    .then(next);
};

export default queryJob;
