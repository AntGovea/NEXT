import { redirect } from "next/navigation";

export default function Home() {

  redirect('/dashboard');
  return (
    <div className="text-5xl">Hola mundo</div>
  )
}
