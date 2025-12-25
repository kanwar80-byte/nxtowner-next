"use client";
import dynamic from "next/dynamic";

const ComparisonTable = dynamic(
  () => import("@/components/platform/ComparisonTable"),
  { ssr: false }
);

export default function CompareClient(props: any) {
  return <ComparisonTable {...props} />;
}
