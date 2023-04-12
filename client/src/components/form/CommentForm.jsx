import React from "react";
import { useState } from "react";
import {
  addCommentAction,
  getCommentsAction,
  getPostsAction,
  getComPostsAction,
  getSelfPostAction,
} from "../../redux/actions/postActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CommentForm = ({ communityId }) => {
  const dispatch = useDispatch();

  const { postId } = useParams();
  const userData = useSelector((state) => state.auth?.userData);

  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = {
      body,
      user: userData._id,
      post: postId,
    };
    if (userData) {
      try {
        setIsLoading(true);
        await dispatch(addCommentAction(postId, newComment));
        await dispatch(getCommentsAction(postId));
        await dispatch(getSelfPostAction(postId));
        setIsLoading(false);
        setBody("");
        await dispatch(getPostsAction());
        await dispatch(getComPostsAction(communityId));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
     
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <textarea
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required placeholder="write a comment"
          />
        </div>
        <div className="flex justify-end">
        <button
          className={`${
            isLoading ? "bg-gray-500" : "rounded-md py-1 px-2 text-sm font-semibold group transition duration-300 text-primary border border-dashed border-blue-500"
          } hover:bg-primary  py-2 px-4 rounded hover:text-white`}
          type="submit"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.5 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Loading..." : "Comment"}{" "}
        </button>
        </div>
       
      </form>
    </div>
  );
};

export default CommentForm;
