import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-1'
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        const params = {
            Bucket: 'tindress',
            Key: `${Date.now()}-${file.name}`,
            Body: buffer,
            ContentType: file.type,
            ACL: 'public-read'
        };

        const uploadResult = await s3.upload(params).promise();

 

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vision?imageUrl=${uploadResult.Location}`, {

            })
            
            if (!response.ok) {
                throw new Error('Query failed')
            }
            
            const data = await response.json()
            console.log('Upload successful:', data)

            const productLinks = data.map((product: { link: string }) => product.link);

            const photos = await Promise.all(
                productLinks.map(async (url: any) => {
                    console.log(url)
                    const scrapeResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_URL}/api/scrape?url=${encodeURIComponent(url)}`
                    );
        
                    if (!scrapeResponse.ok) {
                        throw new Error(`Failed to scrape ${url}`);
                    }
        
                    return await scrapeResponse.json();
                })
            );

            console.log(photos)
            

        } catch (error) {
            console.error('Error uploading image:', error)
        }
        
        return NextResponse.json({
            success: true,
            url: uploadResult.Location
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}