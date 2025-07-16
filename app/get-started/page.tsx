
import { auth } from "@/auth";
import GetStartedOps from "@/components/get-started-ops";

export default async function GetStartedPage() {
  const session = await auth();

  return <GetStartedOps session={session} />
}