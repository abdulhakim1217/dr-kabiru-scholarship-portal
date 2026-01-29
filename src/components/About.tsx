import { GraduationCap, Users, Target, Heart, User } from "lucide-react";
import drKabiruImage from "@/assets/Dr Kb photo.jpg";

const stats = [
  { number: "150+", label: "Students Supported" },
  { number: "GH₵200K+", label: "Awarded" },
  { number: "Opened to", label: "Partner Institutions" },
  { number: "95%", label: "Graduation Rate" },
];

const values = [
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    description: "Supporting students who demonstrate outstanding academic achievement and potential.",
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Empowering scholars to give back and contribute to their communities.",
  },
  {
    icon: Target,
    title: "Equal Opportunity",
    description: "Ensuring access to quality education regardless of economic background.",
  },
  {
    icon: Heart,
    title: "Mentorship",
    description: "Providing guidance and support throughout the educational journey.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        {/* About Dr Kabiru Tiah Mahama */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-center">
          {/* Photo Section */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              {/* Dr. Kabiru's photo */}
              <div className="w-72 h-96 md:w-80 md:h-[28rem] bg-muted border-2 border-border shadow-lg overflow-hidden">
                <img 
                  src={drKabiruImage} 
                  alt="Dr. Kabiru Tiah Mahama" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary -z-10" />
            </div>
          </div>

          {/* Bio Section */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-mono uppercase tracking-widest text-primary mb-4">
              Meet The Founder
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
              Dr. Kabiru Tiah Mahama
            </h2>
            <p className="text-lg text-muted-foreground font-medium mb-6">
              Member of Parliament, Walewale Constituency
            </p>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Dr. Kabiru Tiah Mahama is the distinguished Member of Parliament for Walewale Constituency 
                and a passionate advocate for education and youth empowerment in Northern Ghana. 
                With years of dedicated public service, he has committed his career to creating 
                opportunities for young people in Walewale Constituency to access quality education.
              </p>
              <p>
                Born and raised in Janga in the North East region of Ghana, Dr. Kabiru understands firsthand the challenges 
                faced by students from underprivileged backgrounds in the constituency. His own 
                educational journey, supported by mentors and community leaders, inspired him 
                to establish this scholarship fund.
              </p>
              <p>
                Through the Dr. Kabiru MP Scholarship Fund, he aims to remove financial barriers 
                to higher education and nurture the next generation of leaders, innovators, 
                and change-makers from Walewale Constituency.
              </p>
            </div>
            
            {/* Quote */}
            <div className="mt-8 bg-background border-l-4 border-primary p-6 shadow-sm">
              <blockquote className="text-lg font-serif italic mb-3">
                "Education is the most powerful tool we can give our youth. When we invest 
                in a student's education, we invest in the future of our nation."
              </blockquote>
              <cite className="text-sm font-mono text-muted-foreground">
                — Dr. Kabiru Tiah Mahama
              </cite>
            </div>
          </div>
        </div>

        {/* About The Fund */}
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
            About The Fund
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            BUILDING FUTURES,<br />ONE STUDENT AT A TIME
          </h2>
          <p className="text-lg text-muted-foreground">
            The Dr. Kabiru MP Scholarship Fund was established to support talented 
            students from Walewale Constituency who face financial barriers to higher education. 
            Through our comprehensive scholarship program, we provide tuition 
            assistance, mentorship, and resources to help scholars succeed.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="bg-background border-2 border-border p-6 shadow-sm"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-2 gap-4">
          {values.map((value) => (
            <div 
              key={value.title}
              className="bg-background border-2 border-border p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <value.icon className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
