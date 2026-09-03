import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: dispatch newsletter subscribe thunk yahan jab backend route bane
    setSubscribed(true);
    setEmail("");
  };

  const linkGroups = [
    {
      title: "Shop",
      links: [
        { to: "/collections/featured-all", label: "Featured" },
        { to: "/collections/men-all", label: "Men" },
        { to: "/collections/women-all", label: "Women" },
        { to: "/cart", label: "Cart" },
      ],
    },
    {
      title: "Policies",
      links: [
        { to: "/privacy-policy", label: "Privacy Policy" },
        { to: "/terms", label: "Terms & Conditions" },
        { to: "/refund-policy", label: "Refund Policy" },
        { to: "/shipping-policy", label: "Shipping Policy" },
      ],
    },
  ];

  const socials = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Newsletter section */}
      <div className="flex flex-col gap-y-8 px-6 sm:px-8 md:px-16 py-12 md:py-16">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Join the Feacherd movement
          </h1>
          <p className="text-gray-300 max-w-xl text-sm sm:text-base">
            Apni zaroorat ki har cheez, ek hi jagah — best price, fast delivery,
            aur exclusive drops seedhe tumhare inbox mein.
          </p>
        </div>

        {subscribed ?
          <p className="text-[#00E1E1] font-semibold border-b border-gray-600 pb-4">
            Subscribed — naye drops sabse pehle tumhare inbox me.
          </p>
        : <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-600 pb-4 gap-4 sm:gap-5"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent flex-1 outline-none text-xl sm:text-2xl md:text-4xl font-bold placeholder-white text-white min-w-0"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#00E1E1] text-black rounded-full font-semibold whitespace-nowrap hover:bg-[#00c9c9] transition-colors self-start sm:self-auto"
            >
              Subscribe
            </button>
          </form>
        }
      </div>

      {/* Links section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 px-6 sm:px-8 md:px-16 py-12 border-t border-gray-800">
        {/* Brand blurb */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="italic font-black uppercase tracking-tight text-white text-2xl leading-none">
              Feacherd
            </span>
            <span className="w-2.5 h-2.5 bg-[#00E1E1] shrink-0" />
          </Link>
          <p className="text-sm text-gray-300 max-w-xs">
            Apni zaroorat ki har cheez, ek hi jagah — best price, fast delivery.
          </p>
        </div>

        {/* Shop + Policies */}
        {linkGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-bold text-lg mb-4">{group.title}</h3>
            <ul className="flex flex-col gap-3 text-gray-300 text-sm">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg mb-4">Contact</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-300">
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="text-[#00E1E1] shrink-0" />
              <span className="break-all">support@feacherd.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="text-[#00E1E1] shrink-0" />
              <span>+91 98765 43210</span>
            </li>
          </ul>
        </div>

        {/* Follow */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <h3 className="font-bold text-lg mb-4">Follow</h3>
          <p className="text-gray-300 mb-4 text-sm">
            Connect with us on our social channels
          </p>
          <div className="flex gap-4">
            {socials.map(({ icon: Icon, href, label }, idx) => (
              <a
                key={idx}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="px-6 sm:px-8 md:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 text-center">
          <p>© {year} Feacherd. All rights reserved.</p>
          <p>Built with ❤️ by Saurav Rawat</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
