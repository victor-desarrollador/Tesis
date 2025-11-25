import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      default: "", // Imagen por defecto si no se proporciona
    },
    categoryType: {
      type: String,
      required: true,
      enum: ["Featured", "Hot categories", "Top categories", "Discount"],
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
