import React, { useState } from "react";
import axios from "axios";
import shortid from "shortid";
import "./style/home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleUrlChange = (event) => {
    setOriginalUrl(event.target.value);
  };

  

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };
  const fetchUrlInfo = async () => {
    try {
      if (!originalUrl.trim()) {
        alert("Please enter a URL before fetching info.");
        return;
      }

      const extractInfoResponse = await axios.post("http://localhost:6002/extract-info", {
        link: originalUrl,
      });

      
      setTitle(extractInfoResponse.data.title || "");
      setDescription(extractInfoResponse.data.description || "");
    } catch (error) {
      console.error("Error fetching URL info:", error);
   
    }
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };


 

  const handleSubmit = async () => {
    try {
      if (!originalUrl.trim()) {
        alert("Please enter a URL before submitting.");
        return;
      }
  
      
      const linkExistsResponse = await axios.post("http://localhost:6002/check-link-exists", {
        link: originalUrl,
      });
  
      if (linkExistsResponse.data.exists) {
        const confirmSubmit = window.confirm(
          "This link already exists. Do you want to submit it anyway?"
        );
  
        if (!confirmSubmit) {
         
          return;
        }
      }
     
      
  
     
      const generatedShortUrl = shortid.generate({
        length: 10,
        characters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      });
      const truncatedShortUrl = generatedShortUrl.substring(0, 6);
      const fullShortUrl = `http://localhost:6002/u/${truncatedShortUrl}`;
      setShortUrl(fullShortUrl);
  
     
      await axios.post("http://localhost:6002/url", {
        link: originalUrl,
        short_link: truncatedShortUrl,
        title,
        tags,
        description,
      });
      navigate("/users");
    } catch (error) {
      console.error("Error storing URL:", error);
      
    }
  };
  

  const navigateToUsersLinks = async () => {
    try {
      navigate("/users");
    } catch (error) {
      console.error("Error fetching last saved link:", error);
    }
  };

  return (
    <div>
      <h2 className="slogan">
        <span>"Link </span>
        <span style={{ color: "blue" }}>Short,</span>
        <span>Link </span>
        <span style={{ color: "blue" }}>Smart"</span>
      </h2>

      <div>
        <h2 className="texts">Trim the excess and amplify the essence of links by using our URL Shortner</h2>
      </div>

      <div className="url">
        <label className="urltext" htmlFor="urlInput">
          Enter the URL:
        </label>
        <input
          className="urlbox"
          type="text"
          id="urlInput"
          value={originalUrl}
          onChange={handleUrlChange}
          placeholder="https://example.com"
        />
        <button className="button" onClick={fetchUrlInfo}>
          <b className="submit">Fetch Info</b>
          </button>
      </div>

      <div className="title">
        <label className="titletext" htmlFor="titleInput">
          Title:
        </label>
        <input
          className="titlebox"
          type="text"
          id="titleInput"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter the title"
        />
      </div>

      <div className="tags">
        <label className="tagstext" htmlFor="tagsInput">
          Tags:
        </label>
        <input
          className="tagsbox"
          type="text"
          id="tagsInput"
          value={tags}
          onChange={handleTagsChange}
          placeholder="Enter tags, separated by commas"
        />
      </div>

      <div className="description">
        <label className="descriptiontext" htmlFor="descriptionInput">
          Description:
        </label>
        <textarea
          className="descriptionbox"
          id="descriptionInput"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter a description"
        />
      </div>

      <div className="url">
        <button className="button" onClick={handleSubmit}>
          <b className="submit">Submit</b>
        </button>
      </div>

      <div className="shorturl">
        <label className="shorturltext" htmlFor="shortUrlInput">
          Short URL:
        </label>
        <input
          className="shorturlbox"
          type="text"
          id="shortUrlInput"
          value={shortUrl}
          readOnly
          placeholder="Short URL will appear here"
        />
      </div>

      <div className="userslist">
        <button className="usersbutton" onClick={navigateToUsersLinks}>
          <b className="users">Users links </b>
        </button>
      </div>
    </div>
  );
}

export default Home;