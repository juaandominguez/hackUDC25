import Navbar from '@/components/components/navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className='w-full'>
      <Navbar/>
      <div className="min-h-screen flex flex-col items-center bg-white text-black">
        <div className="max-w-2xl text-center relative">
          <h1 className="text-5xl font-bold uppercase tracking-tighter z-10 relative">Welcome to ZaraMatch</h1>

          <div className="mt-8 w-full h-64 bg-gray-200 flex items-center justify-center relative">
            <Image
              src="https://static.zara.net/assets/public/20d7/2776/5d514f3b9ca5/f64342d09a80/image-landscape-fit-441c5bd6-271d-4d12-add5-669ee8e959e5-default_0/image-landscape-fit-441c5bd6-271d-4d12-add5-669ee8e959e5-default_0.jpg?ts=1740058081368&w=772"
              width={772}
              height={436}
              alt="Zara Match"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="mt-10 flex gap-4 justify-center">
            <Link href={"/tindress"} className="px-6 py-3 bg-black text-white text-lg font-medium uppercase border border-black hover:bg-white hover:text-black transition">
              TinDress
            </Link>
            <Link href={"/search"} className="px-6 py-3 bg-black text-white text-lg font-medium uppercase border border-black hover:bg-white hover:text-black transition">
              Find a Match
            </Link>
          </div>

          <div className="mt-4 flex gap-4 justify-center">
            <Link href={"/clothing"} className="px-6 py-3 bg-black text-white text-lg font-medium uppercase border border-black hover:bg-white hover:text-black transition">
              Find Clothes
            </Link>
            <Link href={"/for-you"} className="px-6 py-3 bg-black text-white text-lg font-medium uppercase border border-black hover:bg-white hover:text-black transition">
              For You
            </Link>
          </div>

          <div className="mt-4 flex justify-center">
            <Link href={"/favorites"} className="px-6 py-3 bg-black text-white text-lg font-medium uppercase border border-black hover:bg-white hover:text-black transition">
              Favorites
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
