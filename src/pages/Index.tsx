import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Eligibility from "@/components/Eligibility";
import SuccessStories from "@/components/SuccessStories";
import FAQ from "@/components/FAQ";
import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Dr. Kabiru MP Scholarship Fund | Walewale Constituency</title>
        <meta 
          name="description" 
          content="Apply for the Dr. Kabiru MP Scholarship Fund. Financial support for students from Walewale Constituency pursuing higher education in Ghana. Tuition assistance, mentorship, and resources available." 
        />
        <meta name="keywords" content="scholarship, Walewale, Ghana, education, financial aid, university, Dr Kabiru, student support, North East Region" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <About />
          <Eligibility />
          <SuccessStories />
          <FAQ />
          <ApplicationForm />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
