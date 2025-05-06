import React from 'react';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';
import Category from '../../models/Category';
import Shop from '../../components/shop/Shop';

const ShopSlugPage = ({ initialCategory, initialCategoryName }) => (
  <Shop initialCategory={initialCategory} initialCategoryName={initialCategoryName} />
);

export async function getServerSideProps({ params }) {
  const { slug } = params;
  await dbConnect();
  // If slug is a valid ObjectId, redirect to product detail
  if (mongoose.isValidObjectId(slug)) {
    return {
      redirect: {
        destination: `/shop/product/${slug}`,
        permanent: false,
      },
    };
  }
  const cat = await Category.findOne({ slug }).lean();
  if (!cat) {
    return { notFound: true };
  }
  return {
    props: {
      initialCategory: cat.slug,
      initialCategoryName: cat.name,
    },
  };
}

export default ShopSlugPage;