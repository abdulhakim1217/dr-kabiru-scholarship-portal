import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              DR. KABIRU MP<br />SCHOLARSHIP FUND
            </h3>
            <p className="text-primary-foreground/80">
              Empowering the next generation of Walewale Constituency leaders through 
              quality education and financial support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4">Quick Links</h4>
            <nav className="space-y-3">
              <a href="#about" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                About the Fund
              </a>
              <a href="#eligibility" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Eligibility Criteria
              </a>
              <a href="#apply" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Apply Now
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a 
                href="mailto:scholarship@drkabiru.ng" 
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                scholarship@drkabiru.org
              </a>
              <a 
                href="tel:+2348001234567" 
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                +234 800 123 4567
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  Member of Parliament for Walewale Constituency, Ghana<br />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Dr. Kabiru MP Scholarship Fund. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
