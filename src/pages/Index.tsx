import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Eligibility from "@/components/Eligibility";
import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Dr. Kabiru MP Scholarship Fund | Apply for Educational Support</title>
        <meta 
          name="description" 
          content="Apply for the Dr. Kabiru MP Scholarship Fund. Financial support for Nigerian students pursuing higher education. Tuition assistance, mentorship, and resources available." 
        />
        <meta name="keywords" content="scholarship, Nigeria, education, financial aid, university, Dr Kabiru, student support" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <About />
          <Eligibility />
          <ApplicationForm />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
