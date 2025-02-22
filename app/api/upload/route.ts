import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

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
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vision?imageUrl=${uploadResult.Location}`);

            if (!response.ok) {
                throw new Error('Query failed');
            }

            const data = await response.json();

            const productLinks = data.map((product: { link: string }) => product.link);

            const products = await Promise.all(
                productLinks.map(async (url: any) => {
                    const scrapeResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_URL}/api/scrape?url=${encodeURIComponent(url)}`
                    );

                    if (!scrapeResponse.ok) {
                        throw new Error(`Failed to scrape ${url}`);
                    }

                    return await scrapeResponse.json();
                })
            );

            // Format data to match ClothingCard structure
            const formattedProducts = data.map((product: any) => ({
                id: product.id,
                name: product.name,
                price: {
                    currency: product.price?.currency || "USD",
                    value: {
                        current: product.price?.value?.current ?? 0, 
                        original: product.price?.value?.original ?? null
                    }
                },
                link: product.link,
                brand: product.brand
            }));
            

            return NextResponse.json(formattedProducts);
        } catch (error) {
            console.error('Error processing image:', error);
            return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
        }
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
