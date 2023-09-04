import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get(endpoint);

export const addListing = (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("categoryLabel", listing.category.label);
  data.append("categoryId", listing.category.value);
  data.append("questionId", listing.cquestion);
  data.append("cuserId", listing.cuser);
  data.append("substanceValue", listing.substanceValue);
  data.append("substanceLabel", listing.substanceLabel);
  data.append("cuseValue", listing.cuseValue);
  data.append("cuseLabel", listing.cuseLabel);
  data.append("userBadge", listing.userBadge);
  console.log(data);
  // listing.images.forEach((image, index) =>
  //   data.append("images", {
  //     name: "image" + index,
  //     type: "image/jpeg",
  //     uri: image,
  //   })
  // );
  return client.post(endpoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  addListing,
  getListings,
};
