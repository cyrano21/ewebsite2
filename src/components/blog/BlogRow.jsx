/ src/components/blog/BlogRow.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Badge } from 'react-bootstrap';

const BlogRow = ({ blog, onEdit, onDelete }) => {
  const isPredefined = blog.source === 'predefined';

  return (
    <tr key={blog.id}>
      <td>
        <div className="d-flex align-items-center gap-2">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="blog-img-preview" // Ensure this class exists in your CSS
              onError={(e) => e.target.src = 'https://via.placeholder.com/60x60?text=Image'}
            />
          )}
          <div>
            {blog.title}
            {isPredefined && <Badge pill bg="light" text="dark" className="ms-2 fw-normal small">Prédéfini</Badge>}
             {blog.isModifiedFromPredefined && <Badge pill bg="info" text="dark" className="ms-2 fw-normal small">Modifié</Badge>}
          </div>
        </div>
      </td>
      <td>{blog.author}</td>
      <td>{blog.date}</td>
      <td>
        <Badge className="badge-category">{blog.category}</Badge> {/* Ensure this class exists */}
      </td>
      <td>
        <div className="action-buttons"> {/* Ensure this class exists */}
          <Button
            variant="info"
            size="sm"
            className="action-button me-1" // Ensure this class exists
            onClick={() => onEdit(blog)}
            title={isPredefined ? "Éditer (créera une copie)" : "Éditer"}
          >
            <span>✏️</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="action-button" // Ensure this class exists
            onClick={() => onDelete(blog.id)}
            disabled={isPredefined} // Disable delete for predefined
            title={isPredefined ? "Non supprimable" : "Supprimer"}
          >
            <span>🗑️</span>
          </Button>
        </div>
      </td>
    </tr>
  );
};

BlogRow.propTypes = {
  blog: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BlogRow;