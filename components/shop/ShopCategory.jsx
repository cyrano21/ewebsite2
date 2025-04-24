/* eslint-disable react/prop-types */
const title = "Toutes les catégories";

const ShopCategory = ({ filterItem, setItem, menuItems, setProducts, selectedCategory }) => {
  return (
    <>
      <div className="widget-header">
        <h5 className="ms-2">{title}</h5>
      </div>
      <div className="">
        <button className={`m-2 ${selectedCategory === 'All' ? 'bg-warning' : ''}`} onClick={() => filterItem('All')}>
          Tous
        </button>

        {menuItems.map((Val, id) => {
          return (
            <button className={`m-2 ${selectedCategory === Val ? 'bg-warning' : ''}`} onClick={() => filterItem(Val)} key={id}>
              {Val}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ShopCategory;
