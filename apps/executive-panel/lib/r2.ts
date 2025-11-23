import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

export function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export const R2 = {
  async put(key: string, body: Buffer, options: any = {}) {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: body,
        ContentType: options?.httpMetadata?.contentType,
      })
    );
  },

  async putObject({ key, value, httpMetadata }: any) {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: value,
        ContentType: httpMetadata?.contentType,
        CacheControl: httpMetadata?.cacheControl,
        ContentDisposition: httpMetadata?.contentDisposition,
      })
    );
  },

  async getObject(key: string) {
    const res = await client.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
      })
    );

    const body = await res.Body?.transformToByteArray();

    return {
      body,
      size: res.ContentLength,
      contentType: res.ContentType,
    };
  },
};