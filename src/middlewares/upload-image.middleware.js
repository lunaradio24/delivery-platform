import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, AWS_BUCKET } from '../constants/env.constant.js';

const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

export const storeImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      const fileName = `STORE_${Date.now()}_${file.originalname}`;
      callback(null, `upload/${fileName}`);
    },
    acl: `public-read-write`,
  }),
});

export const userImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      const fileName = `USER_${Date.now()}_${file.originalname}`;
      callback(null, `upload/${fileName}`);
    },
    acl: `public-read-write`,
  }),
});

export const menuImage = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, callback) => {
        const fileName = `MENU_${Date.now()}_${file.originalname}`;
        callback(null, `upload/${fileName}`);
      },
      acl: `public-read-write`,
    }),
  });