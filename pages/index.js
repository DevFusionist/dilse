import Head from 'next/head';
import { getFeaturedProducts, getProductsByCategory } from '../data/products';
import Hero from '../components/sections/Hero';
import TrustBar from '../components/sections/TrustBar';
import ProductGrid from '../components/sections/ProductGrid';
import AboutSection from '../components/sections/AboutSection';
import PolicySection from '../components/sections/PolicySection';

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const menProducts = getProductsByCategory('men');
  const womenProducts = getProductsByCategory('women');

  return (
    <>
      <Head>
        <title>The Engrave Co. | Luxury Personalized Gifts, Wallets & Jewelry India</title>
        <meta
          name="description"
          content="Discover exquisite personalized gifts India. Customized wallets, engraved jewelry, and premium personalized items. Luxury personalization with fast delivery across India."
        />
        <meta
          name="keywords"
          content="personalized gifts India, customized wallets, engraved jewelry, custom gifts delivery, luxury personalization, personalized gifts online"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <TrustBar />
      
      <ProductGrid
        id="featured"
        title="Bestselling Engraved Creations"
        products={featuredProducts}
        bgColor="bg-white"
      />

      <ProductGrid
        id="category-men"
        title="Gifts for Men"
        products={menProducts}
        bgColor="bg-white"
      />

      <ProductGrid
        id="category-women"
        title="Gifts for Her"
        products={womenProducts}
        bgColor="bg-brand-beige"
      />

      <AboutSection />
      <PolicySection />
    </>
  );
}
