import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="size-full flex justify-center items-center overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <main className="flex gap-4 items-center flex-col">
        <h1 className="text-2xl font-bold">SimplCMS</h1>
        <Link href="/setup">
          <Button className="text-xl p-8 bg-transparent bg-zinc-800 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,transparent_100%)] hover:scale-[98%] hover:translate-y-[2px] transition-all">
            ✨ Get Started
          </Button>
        </Link>

        <a
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read our docs
        </a>
      </main>
    </div>
  );
}
