export interface BlogImage {
  id?: string;
  _id?: string;
  url?: string;
  alt?: string;
  contentPath?: string;
  originalName?: string;
}

export interface BlogData {
  id?: string;
  title: string;
  content: string;
  dateCreated?: Date | string;
  imageUrl?: string | null;
  image?: BlogImage | string | null;
  imageId?: string | null;
  [key: string]: unknown;
}

export type BlogPayload = BlogData;

export const getBlogImageUrl = (blog?: BlogData | null) => {
  if (!blog) return null;
  if (typeof blog.imageUrl === "string") return blog.imageUrl;
  if (typeof blog.image === "string") return blog.image;
  if (typeof blog.image?.url === "string") return blog.image.url;
  if (typeof blog.image?.contentPath === "string") {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.testaws.xyz/api";
    return new URL(blog.image.contentPath, apiBaseUrl).toString();
  }
  return null;
};

export const getBlogImageId = (blog?: BlogData | null) => {
  if (!blog) return null;
  if (typeof blog.imageId === "string") return blog.imageId;
  if (typeof blog.image === "string") return blog.image;
  return blog.image?.id ?? blog.image?._id ?? null;
};
