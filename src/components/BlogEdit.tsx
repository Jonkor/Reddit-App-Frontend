import { useEffect, useState } from "react";
import { updateBlog } from "../reducers/blogReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNotification } from "../reducers/notificationReducer";
import { TextInput, Label, Button, Textarea, Spinner } from "flowbite-react";
import BlogFooter from "./BlogFooter";
import ImagePicker from "./ImagePicker";
import uploadService from "../services/uploads";
import { getBlogImageId, getBlogImageUrl, type BlogPayload } from "../types/blog";

const BlogEdit = ({ blog }) => {
  const dispatch = useDispatch<any>();
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (blog) {
      setNewTitle(blog.title);
      setNewContent(blog.content);
      setImageFile(null);
      setRemoveCurrentImage(false);
    }
  }, [blog]);

  const navigate = useNavigate();
  if (blog === undefined) {
    return <Spinner />;
  }
  const editBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      ...blog,
      title: newTitle,
      content: newContent,
      dateCreated: new Date(),
    };
    void editNewBlog(blogObject);
  };

  const editNewBlog = async (blogObject: BlogPayload) => {
    setIsSubmitting(true);
    try {
      const uploadedImageId = imageFile
        ? await uploadService.uploadImage(imageFile, setUploadProgress)
        : undefined;
      const imageId = uploadedImageId ?? (removeCurrentImage ? null : getBlogImageId(blog));
      const notif1 = {
        message: `Post was successfully edited`,
        type: "success",
      };
      await dispatch(updateBlog({ ...blogObject, imageId }));
      navigate(`/posts/${blog.id}`);

      dispatch(setNotification(notif1, 2500));
    } catch (exception) {
      const notif2 = {
        message: `Cannot edit post`,
        type: "failure",
      };
      dispatch(setNotification(notif2, 2500));
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <>
      <div className="">
        <main className="pt-8 pb-16 lg:pt-16 lg:pb-12 bg-white dark:bg-gray-900 min-h-screen">
          <div className="flex justify-between px-4 mx-auto max-w-6xl ">
            <article className="mx-auto w-full max-w-6xl	 format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
              <header className="mb-4 lg:mb-6 not-format">
                <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                  Edit Post
                </h1>
                <address className="flex items-center mb-6 not-italic"></address>
              </header>
              <form onSubmit={editBlog} className="flex flex-col gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="post-title" value="Title of Post" />
                  </div>
                  <TextInput
                    id="post-title"
                    type="text"
                    placeholder="An Amazing Post"
                    required={true}
                    value={newTitle}
                    onChange={({ target }) => setNewTitle(target.value)}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="post-content" value="Content of Post" />
                  </div>
                  <Textarea
                    required={true}
                    value={newContent}
                    placeholder="Text"
                    onChange={({ target }) => setNewContent(target.value)}
                    rows={10}
                  />
                </div>

                <ImagePicker
                  file={imageFile}
                  onChange={setImageFile}
                  currentImageUrl={getBlogImageUrl(blog)}
                  removeCurrentImage={removeCurrentImage}
                  onRemoveCurrentImage={setRemoveCurrentImage}
                  disabled={isSubmitting}
                  uploadProgress={uploadProgress}
                />

                <Button className="mt-4 w-32" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? uploadProgress !== null
                      ? "Uploading..."
                      : "Saving..."
                    : "Submit"}
                </Button>
              </form>
            </article>
          </div>
        </main>
      </div>

      <BlogFooter />
    </>
  );
};

export default BlogEdit;
