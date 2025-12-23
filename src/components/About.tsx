import { GraduationCap, Users, Target, Heart } from "lucide-react";

const stats = [
  { number: "500+", label: "Students Supported" },
  { number: "₦50M+", label: "Awarded Since 2018" },
  { number: "15+", label: "Partner Universities" },
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
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
            About The Fund
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            BUILDING FUTURES,<br />ONE STUDENT AT A TIME
          </h2>
          <p className="text-lg text-muted-foreground">
            The Dr. Kabiru MP Scholarship Fund was established to support talented 
            Nigerian students who face financial barriers to higher education. 
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
