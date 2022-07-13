import { DefaultNoComponentGlobalConfig } from "ngx-toastr";
import { config } from "./config";

let configS3 = [];

let env = config.mode;


configS3['development'] = {
  accessKeyId: 'AKIAXDGTPD32BN3NQ5ZH',
  secretAccessKey: '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',
  bucketName: 'rao-conduct',
subfolders: ['Development', 'Production', 'Testing'],
region: 'eu-west-2'
}

configS3['testing'] = {
  accessKeyId: 'AKIAXDGTPD32BN3NQ5ZH',
  secretAccessKey: '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',
  bucketName: 'rao-conduct',
  subfolders: ['Development', 'Production', 'Testing'],
  region: 'eu-west-2'
}

configS3['production'] = {
  accessKeyId: 'AKIAXDGTPD32BN3NQ5ZH',
  secretAccessKey: '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',
  bucketName: 'rao-conduct-production',
  region: 'ap-south-1'
}

export const s3Config = configS3[env];



