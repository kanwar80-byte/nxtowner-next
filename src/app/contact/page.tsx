export default function ContactPage() {
  return (
    <main>
      <section className="bg-[#0A122A] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">Get in Touch</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Have questions? Our team is here to help with your acquisition journey.</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316]" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316]" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea rows={6} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316]"></textarea>
            </div>
            <button className="w-full bg-[#F97316] text-white rounded-full py-3 font-semibold hover:shadow-lg hover:scale-[1.02] transition-all">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  );
}
