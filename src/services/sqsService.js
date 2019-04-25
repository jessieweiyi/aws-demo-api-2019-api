import Logger from '../utils/logger';

const logger = Logger.logger('SQSService');

export default class SQSService {
  constructor(AWS, sqsConfig) {
    this.config = sqsConfig;
    this.sqs = new AWS.SQS();
  }

  enQueue(job) {
    const body = JSON.stringify(job);
    const params = {
      DelaySeconds: this.config.delaySeconds,
      MessageAttributes: {
        jobId: {
          DataType: 'String',
          StringValue: job.jobId
        }
      },
      MessageBody: body,
      QueueUrl: this.config.queueUrl
    };

    return new Promise((resolve, reject) => {
      this.sqs.sendMessage(params, (err, data) => {
        if (err) {
          logger.error('Enqueue failed', err, job);
          reject(err);
        } else {
          logger.info('Enqueued job', data, job);
          resolve(data);
        }
      });
    });
  }
}
