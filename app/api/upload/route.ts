import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

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

            // const productLinks = data.map((product: { link: string }) => product.link);
            const productLinks = ["https://www.zara.com/es/es/jeans-slim-cropped-fit-p04551402.html?v1=433643651&v2=2443335", "https://www.zara.com/es/es/trench-largo-water-repellent-p04315500.html?v1=425252061&v2=2443335", "https://www.massimodutti.com/es/parka-capucha-mezcla-algodon-l03477514?pelement=45813620", "https://www.massimodutti.com/es/chaqueta-algodon-detalle-cuello-piel-l03483518?pelement=48639308", "https://www.bershka.com/es/camiseta-manga-corta-cropped-c0p175233157.html?colorId=250"]

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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log(req)
  const { searchParams } = new URL(req.url!, `http://${req.headers.host}`);
  const imageURL = searchParams.get("imageUrl");

  if(!imageURL) {
    return NextResponse.json(
      { message: "bad request" },
      { status: 400 }
    );
    
  }
  const url =
    `https://api-sandbox.inditex.com/pubvsearch-sandbox/products?image=${imageURL}`;
  const token = process.env.PUBLIC_INDITEX_TOKEN;

  try {
    // Execute curl request
   


    // Parse and return JSON response
    const data = JSON.parse(stdout);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json({ error: "Failed to fetch data" });
  }
}