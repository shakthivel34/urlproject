import React, { useState, useEffect } from "react";
import axios from "axios";
import './style/userslinks.css';

function UserLists() {
  const [savedLinks, setSavedLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedLinks = async () => {
      try {
        const response = await axios.get('http://localhost:6002/saved');
        setSavedLinks(response.data.savedLinks || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved links:', error);
        setLoading(false);
      }
    };

    fetchSavedLinks();
  }, []); 

  return (
    <div className="list">
      <h2>Saved Links</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bookmark-list">
          {savedLinks.map(({ short_link, link, tags, title, description }) => (
            <div key={short_link} className="bookmark-card">
              <div className="bookmark-header">
                <strong>{title}</strong>
              </div>
              <div className="bookmark-content">
                <p>{description}</p>
                <div>
                  <strong>Tags:</strong> {tags}
                </div>
                <div>
                  <strong>Short Link:</strong>{" "}
                  <a href={`http://localhost:6002/u/${short_link}`} target="_blank" rel="noopener noreferrer">
                    {`http://localhost:6002/u/${short_link}`}
                  </a>
                </div>
                <div>
                  <strong>Original Link:</strong>{" "}
                  <input type="text" value={link}  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserLists;
