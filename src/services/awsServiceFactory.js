import AWS from 'aws-sdk';
import S3Service from './s3Service';

const awsConfig = {
  region: process.env.AWS_REGION
};

AWS.config.update(awsConfig);

export default class AWSServiceFactory {
  static getS3Service() {
    const s3Config = {
      bucket_name: process.env.AWS_S3_BUCKET_NAME,
      endpoint: process.env.AWS_S3_ENDPOINT
    };
    return new S3Service(AWS, s3Config);
  }
}
