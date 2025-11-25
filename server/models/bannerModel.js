import mongoose from "mongoose";

const bannerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startFrom: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    bannerType: {
      type: String,
      required: true,
      enum: ["hero", "sale", "discount", "category", "other"], // ajustable
      default: "other",
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
