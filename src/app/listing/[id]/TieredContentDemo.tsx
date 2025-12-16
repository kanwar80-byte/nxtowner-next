import { TieredContent } from "@/components/common/TieredContent";

export default function TieredContentDemo() {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <TieredContent userTier="FREE" requiredTier="PRO">
        <div className="p-6 bg-green-100 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">You have access!</h2>
          <p>This content is visible to users with PRO or higher access.</p>
        </div>
      </TieredContent>
    </div>
  );
}
