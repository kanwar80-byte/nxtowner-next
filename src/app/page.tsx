import { Suspense } from "react";
import HomePageClient from "./home/HomePageClient";

export default function HomePage() {
  return (
    <Suspense fallback={<div />}>
      <HomePageClient />
    </Suspense>
  );
}
