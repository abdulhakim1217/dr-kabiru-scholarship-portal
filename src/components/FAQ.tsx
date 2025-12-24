import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who is eligible to apply for the Dr. Kabiru MP Scholarship?",
    answer: "The scholarship is open to Nigerian students currently enrolled in accredited universities within Nigeria. Applicants must have a minimum CGPA of 3.0 on a 5.0 scale (or equivalent), demonstrate financial need, and show strong academic potential and community involvement."
  },
  {
    question: "What documents are required for the application?",
    answer: "You will need to submit: a completed application form, academic transcript showing your current CGPA, a personal application letter explaining your goals and financial need, a nomination letter from a faculty member or community leader, and any other supporting documents that strengthen your application."
  },
  {
    question: "What is the application deadline?",
    answer: "Application deadlines vary by academic year. Please check the official announcement on this website or follow our social media channels for the most current deadline information. We recommend submitting your application early to avoid any last-minute technical issues."
  },
  {
    question: "How are scholarship recipients selected?",
    answer: "Applications are reviewed by a selection committee based on academic merit, financial need, quality of application materials, and community involvement. Shortlisted candidates may be invited for an interview. Final decisions are made by the scholarship board."
  },
  {
    question: "What does the scholarship cover?",
    answer: "The scholarship provides financial support for tuition fees, books, and essential academic materials. The exact amount varies based on the recipient's needs and available funds. Recipients also gain access to mentorship programs and networking opportunities."
  },
  {
    question: "Can I apply if I have received other scholarships?",
    answer: "Yes, you may still apply. However, you must disclose any other scholarships or financial aid you are receiving. The selection committee may consider this when determining the scholarship amount to ensure fair distribution of resources."
  },
  {
    question: "How will I be notified if I am selected?",
    answer: "All applicants will be notified of their application status via the email address provided in their application. Selected recipients will receive detailed instructions about next steps, including any required documentation and fund disbursement procedures."
  },
  {
    question: "Can I reapply if my application is not successful?",
    answer: "Yes, unsuccessful applicants are encouraged to reapply in subsequent application cycles. We recommend reviewing your application materials and strengthening areas that may have been weak in your initial submission."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about the scholarship application process
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
