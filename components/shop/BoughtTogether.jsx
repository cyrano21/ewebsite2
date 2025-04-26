// components/shop/BoughtTogether.js
import React from 'react';
import { Card, ListGroup, Form, Button, Image as BootstrapImage } from 'react-bootstrap';
import Link from 'next/link'; // Import Link for potential product links

// Internal helper component for each item in the list
const BoughtTogetherItem = ({ item, isChecked, onToggle, isMainItem = false }) => {
    // Basic validation
    if (!item || !item.id) return null;

    // Determine the correct price and image source
    const price = (isMainItem ? (item.salePrice || item.price) : item.price) || 0;
    const imageSrc = (isMainItem ? item.thumbnails?.[0] || item.img : item.img) || "https://via.placeholder.com/40?text=N/A";
    const itemName = item.name || 'Item Name Unavailable';

    return (
         <ListGroup.Item className="d-flex align-items-center p-1 border-0 bg-transparent">
             {/* Add '+' sign visually for related items */}
             {!isMainItem && <span className="mx-1 text-muted fw-bold fs-5 lh-1 align-self-center" style={{ marginTop: '-0.2rem' }}>+</span>}

             {/* Checkbox */}
             <Form.Check
                 type="checkbox"
                 id={`bought-together-${item.id}`}
                 checked={isChecked}
                 onChange={isMainItem ? undefined : onToggle} // Only allow toggling related items
                 disabled={isMainItem} // Disable checkbox for the main item
                 className="me-2 flex-shrink-0"
                 aria-label={`Select ${itemName}`}
                 style={{ transform: 'scale(0.9)' }} // Slightly smaller checkbox
             />

             {/* Image - Correction ici */}
             <Link href={`/shop/${item.id}`} passHref legacyBehavior>
                <a className="flex-shrink-0">
                     <BootstrapImage
                         src={imageSrc}
                         width={40}
                         height={40}
                         className="me-2 rounded object-fit-contain"
                         alt={itemName}
                         onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/40?text=Err"; }}
                     />
                 </a>
             </Link>

             {/* Item Details - Correction ici */}
             <div className="flex-grow-1 small ms-1 overflow-hidden"> {/* Added overflow-hidden */}
                 <Link href={`/shop/${item.id}`} passHref legacyBehavior>
                     <a className="text-decoration-none text-dark d-block text-truncate"> {/* Added text-truncate */}
                         {isMainItem ? <><span className="fw-semibold">This item:</span> {itemName}</> : itemName}
                     </a>
                 </Link>
                 <div className="fw-bold">€{price.toFixed(2)}</div>
             </div>
         </ListGroup.Item>
     );
 };


// Main BoughtTogether Component
const BoughtTogether = ({ mainProduct, relatedItems, checkedItems, onToggleItem, total }) => {
    // Basic validation
    if (!mainProduct || !mainProduct.id) {
         return <Card className="bought-together-card mb-4"><Card.Body><Card.Text className="text-muted small">Could not load items.</Card.Text></Card.Body></Card>;
    }

    // Ensure relatedItems is an array, default to empty if not
    const validRelatedItems = Array.isArray(relatedItems) ? relatedItems : [];
    // Ensure checkedItems is an object, default to empty if not
    const validCheckedItems = typeof checkedItems === 'object' && checkedItems !== null ? checkedItems : {};

    // Calculate count of *actually* checked items (excluding the mandatory main one if needed)
    // Let's count ALL checked items including the main one for the button text
    const checkedCount = Object.values(validCheckedItems).filter(Boolean).length;

    // The main product is always considered checked conceptually in the UI state passed in
    const mainItemChecked = validCheckedItems[mainProduct.id] === true;

  return (
    <Card className="bought-together-card mb-4 shadow-sm"> {/* Added shadow-sm */}
      <Card.Body>
        <Card.Title as="h6" className="mb-3 fw-semibold">
          Frequently Bought Together
        </Card.Title>
        <ListGroup variant="flush" className="bg-transparent mb-3"> {/* Added mb-3 */}
           {/* Display Main Product */}
           <BoughtTogetherItem
                item={mainProduct} // Pass the whole mainProduct object
                isChecked={mainItemChecked}
                onToggle={() => {}} // No toggle needed for main item
                isMainItem={true}
            />

          {/* Display Related Items */}
          {validRelatedItems.map((it) => (
            <BoughtTogetherItem
              key={it.id}
              item={it}
              isChecked={!!validCheckedItems[it.id]} // Ensure boolean value
              onToggle={() => onToggleItem(it.id)} // Pass the toggle handler
            />
          ))}
        </ListGroup>
        {/* <hr className="my-2" /> */} {/* Optional separator */}
        <div className="d-flex justify-content-between align-items-center pt-2 border-top"> {/* Added border-top */}
          <span className="fw-bold">Total: €{total || '0.00'}</span>
          <Button
            variant="warning"
            size="sm"
             // Disable if only the main item is checked (count <= 1) or if total is 0/invalid
            disabled={checkedCount <= 1 || !total || parseFloat(total) <= 0}
            onClick={() => alert(`TODO: Add ${checkedCount} items (Total: €${total}) to cart`)} // Replace with actual cart logic
          >
            Add {checkedCount} {checkedCount !== 1 ? 'items' : 'item'} to cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BoughtTogether;