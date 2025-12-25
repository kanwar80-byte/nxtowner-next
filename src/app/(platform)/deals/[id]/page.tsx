import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function DealsIdRedirect({ params }: PageProps) {
  const { id } = await params;
  redirect(`/deal-room/${id}`);
}