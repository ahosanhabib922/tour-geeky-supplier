import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Cloudflare R2 uses the S3-compatible API
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(file: Buffer, fileName: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  });

  try {
    await s3.send(command);
    // Construct the public URL (you'll need to set up a custom domain or use the R2 dev subdomain)
    return `${process.env.R2_PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw error;
  }
}
