import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <span className="text-3xl">Hola mundo!!!</span>
      <Link href={'/about'} className="text-3xl rounded outline bg-yellow-300 p-4 cursor-pointer">About</Link>
    </main>
  );
}
