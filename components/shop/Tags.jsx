import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

const Tags = ({ tags, selectedTag, onTagClick, title = "Tags populaires" }) => {
    // Affiche toujours le titre, même si la liste est vide
    return (
      <div className="mb-4">
        <h4 className="fw-bold mb-3">{title}</h4>
        <div className="d-flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags.map((tag, idx) => (
              <Button
                key={idx}
                variant={selectedTag === tag ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </Button>
            ))
          ) : (
            <span className="text-muted">Aucun tag disponible</span>
          )}
        </div>
      </div>
    );
  };

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTag: PropTypes.string,
  onTagClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default Tags;
