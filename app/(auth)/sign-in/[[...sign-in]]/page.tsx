import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: image (top on small, left on md+) */}
      <div className="relative w-full md:w-1/2 h-56 sm:h-72 md:h-auto">
        <Image src="/sign.jpg" alt="Sign" fill className="object-cover" priority />
        {/* gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        {/* heading on image */}
        <div className="absolute inset-0 flex items-center justify-center md:justify-start md:pl-12 px-4">
          <h2 className="text-white text-center font-extrabold text-2xl sm:text-3xl md:text-5xl leading-tight drop-shadow-lg">
            Welcome to Student Form
          </h2>
        </div>
      </div>

      {/* Right: sign-in */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md md:max-w-lg p-4 md:p-6 bg-white/90 dark:bg-black/70 rounded-lg shadow-lg overflow-auto max-h-[90vh]">
          <SignIn />
        </div>
      </div>
    </div>
  );
}