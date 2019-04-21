import Logger from '../utils/logger';

const logger = Logger.logger('S3Service');

export default class S3Service {
  constructor(AWS, s3config) {
    this.config = s3config;
    const connConfig = {};
    if (this.config.endpoint) {
      connConfig.endpoint = this.config.endpoint;
    }
    connConfig.s3ForcePathStyle = true;
    this.s3 = new AWS.S3(connConfig);
  }

  uploadObject(buffer, objectKey, contentLength) {
    const self = this;

    return new Promise((resolve, reject) => {
      self.s3.putObject({
        Bucket: self.config.bucket_name,
        Key: objectKey,
        Body: buffer,
        ContentLength: contentLength
      }, (err) => {
        if (err) {
          reject(err);
        } else {
          logger.debug('S3 Object Uploaded', { objectKey });
          resolve(objectKey);
        }
      });
    });
  }
}
