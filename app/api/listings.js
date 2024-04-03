import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get(endpoint);

export const addListing = (combinedData, onUploadProgress) => {
  //console.log("----before api");
  //console.log(updatedResponses);
  //console.log("----before api----");

  const data = new FormData();
  data.append("payload", JSON.stringify(combinedData)); // Make sure to stringify
  data.append("userId", combinedData.userId); // Assuming userId is part of updatedResponses
  //console.log(data);

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
