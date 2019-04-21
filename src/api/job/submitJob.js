import uuidV1 from 'uuid/v1';
import AWSServiceFactory from '../../services/awsServiceFactory';
import Logger from '../../utils/logger';

const logger = Logger.logger('routeSubmitJob');

function submitJob(req, res, next) {
  const jobId = uuidV1();
  const { fileName } = req.params;
  const sqsService = AWSServiceFactory.getSQSService();
  const s3Service = AWSServiceFactory.getS3Service();
  const objectKey = `${jobId}/${fileName}`;
  const contentLength = req.headers['Content-Length'];

  return s3Service.uploadObject(req.body, objectKey, contentLength).then((returnedKey) => {
    const job = {
      jobId,
      objectKey: returnedKey
    };
    return sqsService.enQueue(job);
  })
    .then(() => res.status(200).json({ jobId }))
    .catch((error) => {
      logger.error(error);
      res.status(500);
    })
    .then(next);
}

module.exports = submitJob;
