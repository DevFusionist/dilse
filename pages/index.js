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
        {/* Primary Meta Tags */}
        <title>dilse - Dil se bana, dil tak pahunchne wala gift.</title>
        <meta
          name="title"
          content="dilse - Dil se bana, dil tak pahunchne wala gift."
        />
        <meta
          name="description"
          content="Dil se bana, dil tak pahunchne wala gift. Handcrafted personalized gifts that reach straight to the heart. Premium engraved jewelry, customized wallets, and personalized items delivered across India."
        />
        <meta
          name="keywords"
          content="personalized gifts India, customized wallets, engraved jewelry, custom gifts delivery, luxury personalization, personalized gifts online, dilse, handcrafted gifts, personalized jewelry India"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English, Hindi" />
        <meta name="author" content="dilse" />
        <link rel="icon" href="/favicon/favicon.png" />
        <link rel="canonical" href="https://dilse.in/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dilse.in/" />
        <meta property="og:title" content="dilse - Dil se bana, dil tak pahunchne wala gift." />
        <meta property="og:description" content="Dil se bana, dil tak pahunchne wala gift. Handcrafted personalized gifts that reach straight to the heart." />
        <meta property="og:image" content="https://dilse.in/images/IMG_20251128_085724.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="dilse" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://dilse.in/" />
        <meta name="twitter:title" content="dilse - Dil se bana, dil tak pahunchne wala gift." />
        <meta name="twitter:description" content="Dil se bana, dil tak pahunchne wala gift. Handcrafted personalized gifts that reach straight to the heart." />
        <meta name="twitter:image" content="https://dilse.in/images/IMG_20251128_085724.jpg" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "dilse",
              "description": "Dil se bana, dil tak pahunchne wala gift. Handcrafted personalized gifts.",
              "url": "https://dilse.in",
              "logo": "https://dilse.in/favicon/favicon.png",
              "sameAs": []
            })
          }}
        />

        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "dilse",
              "url": "https://dilse.in",
              "description": "Dil se bana, dil tak pahunchne wala gift.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://dilse.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* Structured Data - Store */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "dilse",
              "description": "Personalized gifts and custom engraved items",
              "url": "https://dilse.in",
              "image": "https://dilse.in/images/IMG_20251128_085724.jpg"
            })
          }}
        />
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
