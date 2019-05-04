import uuidV1 from 'uuid/v1';
import AWSServiceFactory from '../../services/awsServiceFactory';
import Logger from '../../utils/logger';

const logger = Logger.logger('routeSubmitJob');

const submitJob = (req, res, next) => {
  const jobId = uuidV1();
  const { fileName } = req.params;
  const objectKey = `${jobId}/${fileName}`;
  const job = {
    jobId,
    objectKey
  };
  const sqsService = AWSServiceFactory.getSQSService();
  const s3Service = AWSServiceFactory.getS3Service();
  const dbService = AWSServiceFactory.getDBService();
  return s3Service.uploadObject(req.body, objectKey)
    .then(() => dbService.addJob(job))
    .then(() => sqsService.enQueue(job))
    .then(() => res.status(200).json({ jobId }))
    .catch((error) => {
      logger.error(error);
      res.status(500);
    })
    .then(next);
};

export default submitJob;
