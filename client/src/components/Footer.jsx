import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Globe, Share2, MessageSquare } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-800/80 mt-16">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Truck size={18} />
              </div>
              <span className="text-xl font-black text-white font-outfit tracking-tight">
                BACKHAUL<span className="text-blue-500">X</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 font-normal leading-relaxed max-w-sm">
              Smarter Routes. A Cleaner Tomorrow.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              AI-powered backhaul optimization connecting Indian carriers with verified high-yield return shipments.
            </p>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 font-outfit">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/carrier" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/carrier/loads" className="hover:text-white transition-colors">Find Loads</Link></li>
              <li><Link to="/carrier/capacity" className="hover:text-white transition-colors">My Capacity</Link></li>
              <li><Link to="/carrier/trips" className="hover:text-white transition-colors">Trips</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 font-outfit">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 font-outfit">
              Resources
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            © 2024 BackhaulX. All rights reserved.
          </div>

          <div className="text-slate-400 font-outfit font-semibold text-center">
            Turning empty miles into a smarter, greener India.
          </div>

          <div className="flex items-center gap-4">
            <a href="#linkedin" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all" title="LinkedIn">
              <Globe size={14} />
            </a>
            <a href="#twitter" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all" title="X / Twitter">
              <Share2 size={14} />
            </a>
            <a href="#youtube" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all" title="Community">
              <MessageSquare size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
