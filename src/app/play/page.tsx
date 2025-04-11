import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
      <p className="-mb-6">Please add params to the URL like that:</p>
      <p>/play/***yourcustomparams***</p>
      <p className="-mb-6">Or go back to main page to use the form:</p>     
      <Link href={"/"}>Home</Link>
      </main>
    </div>
  );
}
