import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializableObject } from "@/utils/convertToObject";

const SearchResultsPage = async ({
  searchParams: { location, propertyType },
}) => {
  await connectDB();

  const locationPattern = new RegExp(location, "i");
  //mongo DB matches
  let query = {
    $or: [
      { name: locationPattern },
      { description: locationPattern },
      { "location.street": locationPattern },
      { "location.city": locationPattern },
      { "location.state": locationPattern },
      { "location.zipcode": locationPattern },
    ],
  };
  //building a query for DB to match values
  if (propertyType && propertyType !== "All") {
    const typePattern = new RegExp(propertyType, "i");
    query.type = typePattern;
  }

  const propertiesQueryResults = await Property.find(query).lean();
  const properties = convertToSerializableObject(propertiesQueryResults);

  return <div>Search Results</div>;
};

export default SearchResultsPage;
