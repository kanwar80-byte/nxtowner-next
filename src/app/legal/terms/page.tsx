export default function TermsPage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-extrabold tracking-tight">Terms of Service</h1>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-8 space-y-6">
          <p className="text-gray-700">Last updated: December 2025</p>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Terms & Conditions</h2>
            <p className="text-gray-700">By using NxtOwner.ca, you agree to comply with our terms and conditions.</p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">User Responsibilities</h2>
            <p className="text-gray-700">Users are responsible for maintaining the confidentiality of their accounts and all activities that occur under their account.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
