const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME; // Ensure this is set

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    try {
        const fileName = event.queryStringParameters.fileName;

        const params = {
            Bucket: BUCKET_NAME,
            Key: `uploads/${fileName}`,
            Expires: 60, 
            ContentType: 'application/octet-stream'
        };

        const uploadURL = await s3.getSignedUrlPromise('putObject', params);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uploadURL }),
        };
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};