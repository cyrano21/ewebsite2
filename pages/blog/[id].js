import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import SingleBlog from "../../pages/Blog/SingleBlog";

export default function BlogPostPage() {
  const router = useRouter();
  const { id } = router.query;

  return <Layout>{id && <SingleBlog blogId={id} />}</Layout>;
}
