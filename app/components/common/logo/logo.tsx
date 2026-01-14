import Link from "next/link";
import {CircleDollarSign} from "lucide-react";
import type React from "react";

const Logo = () => {
  return (
    <div className="flex justify-center">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
          <CircleDollarSign className="h-7 w-7 text-primary-foreground" />
        </div>
        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            FinTrack
          </span>
      </Link>
    </div>
  );
}

export default Logo;