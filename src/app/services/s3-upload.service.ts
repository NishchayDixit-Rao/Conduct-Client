import { Injectable } from "@angular/core";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";
import { Observable } from "rxjs";
import * as aws from "aws-sdk";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { config } from "../config";

import { s3Config } from "../credential";
@Injectable({
  providedIn: "root",
})
export class S3UploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file, fileName?, path?) {
    const contentType = file.type;
    const bucket = new S3({
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.secretAccessKey,
      region: s3Config.region,
    });
    const params = {
      Bucket: s3Config.bucketName + "/" + path,
      Key: file.name,
      Body: file,
      // ACL: 'public-read',
      ContentType: contentType,
      ContentEncoding: "base64",
    };

    // bucket.upload(params, function (err, data) {
    //   if (err) {
    //
    //     return err;
    //   }
    //
    //   return data;
    // });
    //for upload progress
    // bucket.upload(params).on('httpUploadProgress', function (evt) {
    //
    // }).send(function (err, data) {
    //   if (err) {
    //
    //     return false;
    //   }
    //
    //   return true;
    // });

    return new Observable<any>((observer) => {
      bucket
        .upload(params)
        .on("httpUploadProgress", function (evt) {
          observer.next(evt);
        })
        .send(function (err, data) {
          if (err) {
            observer.error(err);
          }

          observer.next(data);
        });
    });
  }

  getSize(key, path) {
    // var s3 = new S3();
    return new Observable<any>((observer) => {
      aws.config.credentials = new aws.Credentials({
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      });

      const params = {
        Bucket: s3Config.bucketName + "/" + path,
        Key: key,
      };
      const s3 = new S3({
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
        region: s3Config.region,
      });
      // let s3 = new aws.S3();

      s3.getObject(params, function (err, data) {
        if (err) {
          console.error(err); // an error occurred
        } else {
          // const string = new TextDecoder('utf-8').decode(data.Body);
          //
        }
      });

      //   s3.headObject({ Key: key, Bucket: bucket })
      //     .promise()
      //     .then(res =>
      //       //
      //       observer.next(res.ContentLength)
      //       //  res.ContentLength
      //     );
    });
  }

  /**
   *
   * @param feedbackData adding user feedback to the database.
   * @returns
   */
  addFeedBack(feedbackData) {
    return this.http.put(
      `${config.baseApiUrl}feedback`,
      // config.baseApiUrl + "user/forgot-password",
      feedbackData
    );
  }
}
