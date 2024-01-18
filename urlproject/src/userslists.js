import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/userslinks.css";

function UserLists() {
  const [savedLinks, setSavedLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [editMode, setEditMode] = useState({ shortLink: null, title: false, tags: false });
  const [editedValues, setEditedValues] = useState({ shortLink: null, title: "", tags: "" });
  const [searchInput, setSearchInput] = useState("");
  const [filteredLinks, setFilteredLinks] = useState(savedLinks);

  useEffect(() => {
    const fetchSavedLinks = async () => {
      try {
        const response = await axios.get("http://localhost:6002/saved");
        const fetchedLinks = response.data.allLinks || [];
        setSavedLinks(fetchedLinks);
        setFilteredLinks(fetchedLinks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved links:", error);
        setLoading(false);
      }
    };

    fetchSavedLinks();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLinks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleEditMode = (shortLink) => {
    setEditMode({ ...editMode, shortLink, title: true, tags: true });
    const linkToEdit = filteredLinks.find((link) => link.short_link === shortLink);
    setEditedValues({ ...editedValues, shortLink, title: linkToEdit.title, tags: linkToEdit.tags });
  };

  const handleEditChange = (field, value) => {
    setEditedValues({ ...editedValues, [field]: value });
  };

  const saveChanges = async (shortLink) => {
    try {
      await axios.put(`http://localhost:6002/edit/${shortLink}`, {
        title: editedValues.title,
        tags: editedValues.tags,
      });

      setFilteredLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.short_link === shortLink ? { ...link, title: editedValues.title, tags: editedValues.tags } : link
        )
      );

      setEditMode({ ...editMode, shortLink: null, title: false, tags: false });
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const disableLink = async (shortLink) => {
    try {
      await axios.put(`http://localhost:6002/deactivate/${shortLink}`);

      setFilteredLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.short_link === shortLink ? { ...link, is_active: false } : link
        )
      );
    } catch (error) {
      console.error("Error disabling link:", error);
    }
  };

  const enableLink = async (shortLink) => {
    try {
      await axios.put(`http://localhost:6002/activate/${shortLink}`);

      setFilteredLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.short_link === shortLink ? { ...link, is_active: true } : link
        )
      );
    } catch (error) {
      console.error("Error enabling link:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchInput(input);

    const filtered = savedLinks.filter(
      ({ title, tags }) =>
        title.toLowerCase().includes(input) || tags.toLowerCase().includes(input)
    );

    setFilteredLinks(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="list">
      <h2>Saved Links</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or tags"
          value={searchInput}
          onChange={handleSearchInputChange}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bookmark-list">
          {currentItems.map(({ short_link, link, tags, title, description, is_active }) => (
            <div key={short_link} className={`bookmark-card ${is_active ? '' : 'fade'}`}>
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
                      <br />
                      <strong>Status:</strong> {is_active ? 'Active' : 'Inactive'}
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
                <div className="enable-disable-buttons">
                  {is_active ? (
                    <button className="disable" onClick={() => disableLink(short_link)}>Disable</button>
                  ) : (
                    <button className="enable" onClick={() => enableLink(short_link)}>Enable</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredLinks.length / itemsPerPage) }).map((_, index) => (
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
