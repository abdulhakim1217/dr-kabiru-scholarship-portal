import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import student1 from "@/assets/WALIU-removebg-preview.png";
import student2 from "@/assets/Hafiz Tia.jpg";
import student3 from "@/assets/abdul profile.jpg";

const successStories = [
  {
    id: 1,
    name: "Imoro Abdul Waliu",
    image: student1,
    university: "University for Development Studies",
    course: "Public Health",
    year: "2023",
    testimonial:
      "The Dr. Kabiru MP Scholarship changed my life. Coming from a humble background in Walewale, I never thought I could pursue medicine. This scholarship made my dreams possible, and now I'm in my final year, ready to serve my community.",
  },
  {
    id: 2,
    name: "Tahiru Tia Abdul-Hafiz",
    image: student2,
    university: "UDS",
    course: "Agricultural Engineering",
    year: "2022",
    testimonial:
      "As a woman in STEM, I faced many challenges. The scholarship not only provided financial support but also connected me with mentors who believed in me. Today, I'm excelling in my engineering program and inspiring other girls from my community.",
  },
  {
    id: 3,
    name: "Abdul Karim Hakim",
    image: student3,
    university: "University for Development Studies",
    course: "Computer Science",
    year: "2023",
    testimonial:
      "This scholarship has been life-changing for me. I can now focus entirely on my studies without financial stress. The support from Dr. Kabiru's office has been incredible. I'm currently developing innovative tech solutions to help farmers in Northern Ghana.",
  },
];

const SuccessStories = () => {
  return (
    <section id="success-stories" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-mono uppercase tracking-widest text-primary mb-2">
            Our Impact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Success Stories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet some of the talented students whose lives have been transformed
            through the Dr. Kabiru MP Scholarship Fund.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story) => (
            <Card
              key={story.id}
              className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-lg">{story.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {story.course} • {story.university}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Class of {story.year}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-3" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {story.testimonial}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
