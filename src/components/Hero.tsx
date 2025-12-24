import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";

const Hero = () => {
  const scrollToApply = () => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Empowering Walewale's Future Leaders
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-none">
            DR. KABIRU MP
            <span className="block text-3xl md:text-4xl lg:text-5xl font-normal mt-2">
              SCHOLARSHIP FUND
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Supporting students from Walewale Constituency to pursue higher education. 
            Apply now for financial support to achieve your academic dreams.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={scrollToApply}
              className="text-lg px-8 py-6 shadow-md hover:shadow-lg transition-shadow"
            >
              Apply for Scholarship
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="text-lg px-8 py-6 shadow-sm hover:shadow-md transition-shadow"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
