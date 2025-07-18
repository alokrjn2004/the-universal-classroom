'use client'; 

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  // Session management logic would go here if needed

  return (
    <header className="bg-subtle/30 backdrop-blur-lg fixed top-0 left-0 right-0 z-10 border-b border-black/10">
      <div className="container mx-auto flex justify-between items-center p-4 text-primary">

        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="COMMAND IN LAW Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold tracking-widest uppercase">
            COMMAND IN LAW
          </span>
        </Link>

        <nav>
          <ul className="flex items-center space-x-2">
            <li><a href="#" className="px-5 py-2 rounded-full text-sm font-semibold hover:bg-black/5 transition-all duration-200 transform hover:scale-110">Courses</a></li>
            <li><a href="#" className="px-5 py-2 rounded-full text-sm font-semibold hover:bg-black/5 transition-all duration-200 transform hover:scale-110">About</a></li>
            <li>
              <a href="/login" className="block bg-primary/10 hover:bg-primary/20 backdrop-blur-sm border border-primary/20 text-primary text-sm font-bold px-5 py-2 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                Login
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}