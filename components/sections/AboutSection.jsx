export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-serif text-brand-navy text-center mb-8 font-bold">
          <span className="border-b-4 border-brand-gold pb-1">The Art of Engraving: Our Difference</span>
        </h2>
        <div className="prose prose-lg mx-auto text-center text-gray-700">
          <p className="text-lg mb-4">
            At The Engrave Co., we believe that every gift should tell a story. Our master craftsmen combine
            traditional Indian artistry with modern precision engraving techniques to create heirlooms that last
            generations.
          </p>
          <p className="text-lg mb-4">
            We source only the finest materials—premium leather, sterling silver, and hand-selected woods—ensuring
            that each piece not only looks exquisite but stands the test of time. Every engraving is meticulously
            planned and executed, transforming ordinary items into personalized treasures.
          </p>
          <p className="text-lg">
            From our workshop in India, we deliver luxury personalization with fast, secure shipping across the
            country. Experience the difference of true craftsmanship.
          </p>
        </div>
      </div>
    </section>
  );
}

