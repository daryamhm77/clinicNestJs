import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { extname } from 'path';
import { Keys } from 'src/common/env/env';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: Keys.S3ACCESSKEY,
        secretAccessKey: Keys.S3SECRETKEY,
      },
      endpoint: Keys.S3ENDPOINT,
      region: 'default',
    });
  }
  async uploadFile(file: Express.Multer.File, folderName: string) {
    const ext = extname(file.originalname);
    return await this.s3
      .upload({
        Bucket: Keys.S3BUCKETNAME,
        Key: `${folderName}/${Date.now()}${ext}`,
        Body: file.buffer,
      })
      .promise();
  }
  async deleteFile(Key: string) {
    return await this.s3
      .deleteObject({
        Bucket: Keys.S3BUCKETNAME,
        Key: decodeURI(Key),
      })
      .promise();
  }
}
