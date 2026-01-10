import BrowseTrackPage from "../[track]/page";

export default async function DigitalBrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  return BrowseTrackPage({
    params: { track: "digital" },
    searchParams: resolvedSearchParams,
  } as any);
}
