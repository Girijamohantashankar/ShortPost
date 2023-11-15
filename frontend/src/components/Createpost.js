import React, { useState, useEffect } from "react";
import "./Createpost.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomLoader from "./CustomLoader";

export default function Createpost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(""); // New state for 'type'
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    // saving post to MongoDB
    if (url) {
      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false); // Set loading state to false after completing the post request
          if (data.error) {
            notifyA(data.error);
          } else {
            notifyB("Successfully Posted");
            navigate("/");
            clearForm();
          }
        })
        .catch((err) => {
          setIsLoading(false); // Set loading state to false in case of an error
          notifyA("Failed to create post. Please try again.");
          console.log(err);
        });
    }
  }, [url, navigate]);

  const postDetails = async () => {
    try {
      setIsLoading(true);

      const data = new FormData();
      data.append("file", type === "image" ? image : video);
      const uploadPreset = type === "video" ? "post-video" : "post-image";
      data.append("upload_preset", uploadPreset);
      data.append("cloud_name", "girija");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/girija/video/upload",
        {
          method: "post",
          body: data,
        }
      );

      const responseData = await response.json();
      console.log("Cloudinary Response:", responseData);
      setUrl(responseData.secure_url);
    } catch (error) {
      setIsLoading(false);
      notifyA("Failed to upload media. Please try again.");
      console.error(error);
    }
  };

  const loadfile = (event) => {
    var output = document.getElementById("output");
    const fileType = event.target.files[0].type;
    setType(fileType.startsWith("video") ? "video" : "image");

    if (fileType.startsWith("video")) {
      output.innerHTML = ""; // Clear any previous image
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(event.target.files[0]);
      videoElement.controls = true;
      output.appendChild(videoElement);
    } else if (fileType.startsWith("image")) {
      output.innerHTML = ""; // Clear any previous video
      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(event.target.files[0]);
      imgElement.alt = "Preview";
      output.appendChild(imgElement);
    }
  };

  const clearForm = () => {
    setBody("");
    setImage("");
    setVideo("");
    setUrl("");
  };

  return (
    <div className="createPost">
      {/* header */}
      <div className="post-header">
        <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
        {/* <img id="output" src="https://static.thenounproject.com/png/212328-200.png" /> */}
      </div>
      {/* media preview */}
      <div className="main-div" id="output">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(event) => {
            loadfile(event);
            setType(""); // Clear the 'type' state when a new file is selected
            if (event.target.files[0].type.startsWith("image")) {
              setImage(event.target.files[0]);
            } else if (event.target.files[0].type.startsWith("video")) {
              setVideo(event.target.files[0]);
            }
          }}
        />
      </div>
      {/* details */}
      <div className="details">
        <div className="card-header">
          <h5>{JSON.parse(localStorage.getItem("user")).name}</h5>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          type="text"
          placeholder="Write a caption...."
        ></textarea>
      </div>
      <div className="btn-post">
        <button
          id="post-btn"
          onClick={() => postDetails()}
          disabled={isLoading}
        >
          {isLoading ? <CustomLoader /> : "Post"}
        </button>
      </div>
    </div>
  );
}
