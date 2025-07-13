import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Best Man Speech Generator</h1>
      <p className="text-lg">This is a test</p>
      <Link href="/get-started" className={buttonVariants({ variant: "default" })}>Get Started</Link>
    </div>
  );
}
