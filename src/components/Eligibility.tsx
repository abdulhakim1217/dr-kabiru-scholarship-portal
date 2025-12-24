import { Check, FileText, Calendar, Award } from "lucide-react";

const requirements = [
  "Resident of Walewale Constituency",
  "Currently enrolled or accepted into an accredited Ghanaian tertiary institution",
  "Minimum CGPA of 2.5 or equivalent",
  "Demonstrated financial need",
  "Active participation in community service within Walewale",
  "Strong academic references from your community or institution",
];

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Submit Application",
    description: "Complete the online application form with all required documents.",
  },
  {
    icon: Calendar,
    step: "02",
    title: "Review Process",
    description: "Applications are reviewed by our selection committee within 4-6 weeks.",
  },
  {
    icon: Award,
    step: "03",
    title: "Award Notification",
    description: "Successful applicants receive notification and scholarship disbursement.",
  },
];

const Eligibility = () => {
  return (
    <section id="eligibility" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Requirements */}
          <div>
            <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Eligibility Requirements
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              WHO CAN APPLY?
            </h2>
            <div className="space-y-4">
              {requirements.map((req) => (
                <div 
                  key={req}
                  className="flex items-start gap-4 p-4 border-2 border-border bg-background shadow-2xs"
                >
                  <div className="w-6 h-6 border-2 border-border flex items-center justify-center flex-shrink-0 bg-primary">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Process */}
          <div>
            <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
              How It Works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              APPLICATION PROCESS
            </h2>
            <div className="space-y-6">
              {steps.map((item) => (
                <div 
                  key={item.step}
                  className="flex gap-6 p-6 border-2 border-border bg-secondary shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 border-2 border-border bg-background flex items-center justify-center">
                      <item.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-mono text-muted-foreground mb-1">
                      STEP {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Eligibility;
