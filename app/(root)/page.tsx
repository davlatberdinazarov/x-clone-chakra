'use client';

import Auth from "@/components/auth";
import Demo from "@/components/demo";

export default function Home() {
  let isUserLogin = false;

  if (!isUserLogin) {
    return <Auth/>;
  }
  return (
    <div>
      <Demo/>
    </div>
  );
}
