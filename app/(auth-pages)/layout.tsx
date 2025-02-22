import Navbar from "@/components/components/navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <Navbar/>
    <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div>
    </>
  );
}
