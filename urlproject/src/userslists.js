import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/userslinks.css";

function UserLists() {
  const [savedLinks, setSavedLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Adjust the number of items per page as needed
  const [editMode, setEditMode] = useState({ shortLink: null, title: false, tags: false });
  const [editedValues, setEditedValues] = useState({ shortLink: null, title: "", tags: "" });

  useEffect(() => {
    const fetchSavedLinks = async () => {
      try {
        const response = await axios.get("http://localhost:6002/saved");
        setSavedLinks(response.data.savedLinks || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved links:", error);
        setLoading(false);
      }
    };

    fetchSavedLinks();
  }, []);

  // Calculate indexes for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savedLinks.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle edit mode for a specific short link
  const toggleEditMode = (shortLink) => {
    setEditMode({ ...editMode, shortLink, title: true, tags: true });
    const linkToEdit = savedLinks.find((link) => link.short_link === shortLink);
    setEditedValues({ ...editedValues, shortLink, title: linkToEdit.title, tags: linkToEdit.tags });
  };

  // Handle changes to edited values
  const handleEditChange = (field, value) => {
    setEditedValues({ ...editedValues, [field]: value });
  };

  // Save changes and exit edit mode
  const saveChanges = async (shortLink) => {
    try {
      await axios.put(`http://localhost:6002/edit/${shortLink}`, {
        title: editedValues.title,
        tags: editedValues.tags,
      });

      // Update local state with the edited values
      setSavedLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.short_link === shortLink ? { ...link, title: editedValues.title, tags: editedValues.tags } : link
        )
      );

      // Exit edit mode
      setEditMode({ ...editMode, shortLink: null, title: false, tags: false });
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <div className="list">
      <h2>Saved Links</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bookmark-list">
          {currentItems.map(({ short_link, link, tags, title, description }) => (
            <div key={short_link} className="bookmark-card">
              <div className="bookmark-header">
                {editMode.shortLink === short_link && editMode.title ? (
                  <input
                    type="text"
                    value={editedValues.title}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                  />
                ) : (
                  <strong>{title}</strong>
                )}

                <div className="edit-button-container">
                  {editMode.shortLink === short_link && editMode.title ? (
                    <button onClick={() => saveChanges(short_link)}>Save</button>
                  ) : (
                    <button onClick={() => toggleEditMode(short_link)}>Edit</button>
                  )}
                </div>
              </div>
              <div className="bookmark-content">
                <p>{description}</p>
                <div>
                  {editMode.shortLink === short_link && editMode.tags ? (
                    <input
                      type="text"
                      value={editedValues.tags}
                      onChange={(e) => handleEditChange("tags", e.target.value)}
                    />
                  ) : (
                    <>
                      <strong>Tags:</strong> {tags}
                    </>
                  )}
                </div>
                <div>
                  <strong>Short Link:</strong>{" "}
                  <a href={`http://localhost:6002/u/${short_link}`} target="_blank" rel="noopener noreferrer">
                    {`http://localhost:6002/u/${short_link}`}
                  </a>
                </div>
                <div>
                  <strong>Original Link:</strong>{" "}
                  <input type="text" value={link} readOnly />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(savedLinks.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserLists;
