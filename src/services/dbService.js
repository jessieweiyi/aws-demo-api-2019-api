import Logger from '../utils/logger';

const logger = Logger.logger('DBService');

export default class DBService {
  constructor(AWS, dbConfig) {
    this.config = dbConfig;
    this.dynamoDB = new AWS.DynamoDB({
      endpoint: this.config.endpoint
    });
  }

  addJob(job) {
    const params = {
      Item: {
        jobId: {
          S: job.jobId
        },
        objectKey: {
          S: job.objectKey
        },
        status: {
          S: 'created'
        }
      },
      TableName: this.config.tableName,
      ReturnConsumedCapacity: 'NONE'
    };
    return new Promise((resolve, reject) => {
      this.dynamoDB.putItem(params, (error, data) => {
        if (error) {
          logger.debug('Failed in adding DynamoDB record', error);
          reject(error);
        } else {
          logger.debug('Succeed in adding DynamoDB record', data);
          resolve(data);
        }
      });
    });
  }

  getJob(jobId) {
    const params = {
      Key: {
        jobId: {
          S: jobId
        }
      },
      TableName: this.config.tableName
    };
    return new Promise((resolve, reject) => {
      this.dynamoDB.getItem(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          if (data.Item && data.Item.status) {
            const result = {
              jobId,
              status: data.Item.status.S
            };
            if (data.Item.url) {
              result.url = data.Item.url.S;
            }
            resolve(result);
          }

          resolve(null);
        }
      });
    });
  }
}
