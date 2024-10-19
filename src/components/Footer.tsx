import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <footer className="">
      <div className="w-full font-fred">
        <div className="flex flex-col items-center justify-center text-[#000] text-sm py-4">
          <div className="flex items-center space-x-1">
            <span>© 2024</span>
            <strong className="font-bold">
              <span className="text-[#271282]">Glorious Life </span>
              <span className="text-[#e33901]">Church.</span>
            </strong>
            <span></span>
          </div>
          <div className="flex items-center mt-2">
            <p>The Church With Excellence</p>
            <span className="inline-block h-[1em] ml-2">
              <Image src="/logo.png" alt="GLC LOGO" width={20} height={20} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
