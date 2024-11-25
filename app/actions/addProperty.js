"use server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cloudinary } from "@/config/cloudinary";

async function addProperty(formData) {
  //connect to DB
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }
  //get user ID
  const { userId } = sessionUser;
  //access all values from amenities and images
  const amenities = formData.getAll("amenities");
  const images = formData
    .getAll("images")
    //filter out any images w/o name
    .filter((image) => image.name !== "");

  const propertyData = {
    owner: userId, //allows us to know who is submitting
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zipcode: formData.get("location.zipcode"),
    },
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    square_feet: formData.get("square_feet"),
    amenities,
    rates: {
      nightly: formData.get("rates.nightly"),
      weekly: formData.get("rates.weekly"),
      monthly: formData.get("rates.monthly"),
    },
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },
  };
  const imageUrls = [];

  //loop over image files and convert to base64
  for (const imageFile of images) {
    const imageBuffer = await imageFile.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);

    //convert to base64
    const imageBase64 = imageData.toString("base64");

    //make request to cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      {
        folder: "propertyPulse",
      }
    );
    //secure url needed to access image
    imageUrls.push(result.secure_url);
  }

  propertyData.images = imageUrls;

  const newProperty = new Property(propertyData);
  await newProperty.save();

  revalidatePath("/", "layout");
  //redirect to properties page after submission.
  redirect(`/properties/${newProperty._id}`);
}

export default addProperty;
