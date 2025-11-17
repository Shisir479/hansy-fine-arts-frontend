import CategoryCard, { CategoryType } from "@/components/shop/CategoryCard";

const categories: CategoryType[] = [
  {
    name: "Abstract Art",
    slug: "abstract",
    imageUrl: "/images/categories/abstract.jpg",
    productCount: 45,
  },
  {
    name: "Contemporary Art",
    slug: "contemporary",
    imageUrl: "/images/categories/contemporary.jpg",
    productCount: 38,
  },
  {
    name: "Custom Portraits",
    slug: "portraits",
    imageUrl: "/images/categories/portraits.jpg",
    productCount: 27,
  },
];

export default function Categories() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center mb-10">Browse by Category</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
