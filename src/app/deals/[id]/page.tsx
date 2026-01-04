import { redirect } from "next/navigation";

type Props = { params: { id: string } };

export default function LegacyDealsRedirect({ params }: Props) {
  redirect(`/listing/${params.id}`);
}
