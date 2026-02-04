import { Link } from "react-router-dom";
import { Mail, Github, Twitter, Linkedin, Users } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "How It Works", to: "/how-it-works" },
    { label: "Browse Skills", to: "/marketplace" },
    { label: "Become a Teacher", to: "/teach" },
    { label: "Pricing", to: "/pricing" },
  ],
  support: [
    { label: "Help Center", to: "/help" },
    { label: "FAQs", to: "/faqs" },
    { label: "Contact Us", to: "/contact" },
    { label: "Disputes", to: "/disputes" },
  ],
  company: [
    { label: "About Us", to: "/about" },
    { label: "Careers", to: "/careers" },
    { label: "Blog", to: "/blog" },
    { label: "Press", to: "/press" },
  ],
  legal: [
    { label: "Terms of Service", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Cookie Policy", to: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                <Users className="w-6 h-6 text-black" />
              </div>
              <span className="font-bold text-xl text-yellow-400">SkillSwap</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Exchange skills, not money. Learn from real people, teach what you know.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                <Mail className="w-4 h-4" />
                hello@skillswap.com
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm md:text-base">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm md:text-base">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm md:text-base">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © 2026 SkillSwap. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
          </div>
          
          <span className="text-sm text-gray-400 text-center md:text-right">
            Made with ❤️ for learners everywhere
          </span>
        </div>
      </div>
    </footer>
  );
}
