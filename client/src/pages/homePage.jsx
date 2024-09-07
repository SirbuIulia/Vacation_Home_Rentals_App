import Navbar from "../components/Navbar"
import Slide from "../components/Slide"
import Categories from "../components/Categories"
import Listings from "../components/Listings"
import FAQSection from "../components/FAQSection"
import Footer from "../components/Footer"

const homePage = () => {
  return (
    <>
      <Navbar />
      <Slide />
      <Categories />
      <Listings />
      <FAQSection />
      <Footer />
    </>
  )
}



export default homePage;