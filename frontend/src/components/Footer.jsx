export default function Footer() {
  return (
    <footer className="bg-[rgba(0,0,0,0.8)] text-gray-400 mt-5 py-10 px-5 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Brand */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">BingeFlix</h2>
          <p className="text-sm">Watch. Binge. Repeat.</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Browse</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">TV Shows</a></li>
            <li><a href="#" className="hover:text-white transition">Movies</a></li>
            <li><a href="#" className="hover:text-white transition">New & Popular</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Connect</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Facebook</a></li>
            <li><a href="#" className="hover:text-white transition">Twitter</a></li>
            <li><a href="#" className="hover:text-white transition">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition">Support</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-700 mt-10 pt-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} BingeFlix. All rights reserved.
      </div>
    </footer>
  );
}
