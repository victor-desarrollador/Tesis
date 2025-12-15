import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
      required: false, // Image is optional
    },
    categoryType: {
      type: String,
      required: true,
      enum: [
        "Perfumería",
        "Maquillaje",
        "Cuidado para el Hombre",
        "Cuidado Diario",
        "Cabello",
        "Accesorios de Damas",
        "Otros"
      ], // Mandatory with specific values
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
