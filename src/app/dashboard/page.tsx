export default function DashboardPage() {
  return (
    <main className="py-16 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-nxt-primary mb-4">
        Your NxtOwner Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        You are logged in. This is a simple placeholder dashboard. 
        We will later replace this with:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Saved searches &amp; watched listings</li>
        <li>Active offers &amp; NDAs</li>
        <li>My listings (as a seller)</li>
        <li>Profile &amp; verification status</li>
      </ul>
    </main>
  );
}
