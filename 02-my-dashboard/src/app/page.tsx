import { redirect } from "next/navigation"

function HomePage() {

redirect('dashboard/main');

  return (
    <div>HomePage</div>
  )
}

export default HomePage