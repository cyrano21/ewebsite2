/* eslint-disable react/prop-types */
const title = "Toutes les catégories";

import { useRouter } from "next/router";

const ShopCategory = ({ menuItems, selectedCategory }) => {
  const router = useRouter();

  const handleCategoryClick = (slug) => {
    if (!slug || slug === "undefined") return; // Empêche navigation invalide
    if (slug.toLowerCase() === "all") {
      router.push("/shop");
    } else {
      router.push(`/shop/${slug}`);
    }
  };

  // Filtrer les catégories valides
  const validMenuItems = menuItems.filter((cat) => cat && cat.name && cat.slug);

  // Log pour debug
  console.log("ShopCategory > validMenuItems:", validMenuItems);

  return (
    <>
      <div className="widget-header">
        <h5 className="ms-2">{title}</h5>
      </div>
      <div className="">
        <button
          className={`m-2 ${selectedCategory === "all" ? "bg-warning" : ""}`}
          onClick={() => handleCategoryClick("all")}
        >
          Tous
        </button>
        {validMenuItems.map((cat) => (
          <button
            className={`m-2 ${
              selectedCategory === cat.slug ? "bg-warning" : ""
            }`}
            onClick={() => handleCategoryClick(cat.slug)}
            key={cat._id || cat.slug}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default ShopCategory;
