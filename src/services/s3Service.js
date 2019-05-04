import Logger from '../utils/logger';

const logger = Logger.logger('S3Service');

export default class S3Service {
  constructor(AWS, s3config) {
    this.config = s3config;
    const connConfig = {};
    if (this.config.endpoint) {
      connConfig.endpoint = this.config.endpoint;
    }
    connConfig.s3ForcePathStyle = this.config.s3ForcePathStyle;

    this.s3 = new AWS.S3(connConfig);
  }

  uploadObject(buffer, objectKey) {
    return new Promise((resolve, reject) => {
      this.s3.putObject({
        Bucket: this.config.bucketName,
        Key: objectKey,
        Body: buffer,
        ACL: 'public-read'
      }, (err) => {
        if (err) {
          logger.error(`S3 Object Upload Failed: ${err}`);
          reject(err);
        } else {
          logger.debug('S3 Object Upload Succeed', { objectKey });
          resolve(objectKey);
        }
      });
    });
  }
}
