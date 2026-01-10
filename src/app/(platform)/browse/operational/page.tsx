import BrowseTrackPage from "../[track]/page";

export default async function OperationalBrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  return BrowseTrackPage({
    params: { track: "operational" },
    searchParams: resolvedSearchParams,
  } as any);
}
