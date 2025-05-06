
import React from 'react';
import { Link } from 'next/link';
import { Card } from 'react-bootstrap';

const Tags = ({ tags = [] }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <Card className="shop-widget mb-4">
      <Card.Header>
        <h5 className="m-0">Tags populaires</h5>
      </Card.Header>
      <Card.Body>
        <div className="shop-tags">
          {tags.map((tag, i) => (
            <Link 
              href={`/shop?tag=${tag}`}
              key={i}
              className="tag"
            >
              {tag}
            </Link>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Tags;
