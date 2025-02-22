import AWS from 'aws-sdk'
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-1'
})

export async function POST(req: NextApiRequest, res: NextApiResponse){

    const file = req.body.file;
    const fileName = Date.now() + '-' + file.originalname;
    const params = {
        Bucket: 'tindress',
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    try {
        const data = await s3.upload(params).promise();
        return NextResponse.json({ url: data.Location });
    }catch(error) {
        return NextResponse.json({error})
    }


    
}