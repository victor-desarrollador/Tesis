import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Por favor ingrese una dirección de correo electrónico válida" }),
  password: z.string().min(1, { message: "Por favor ingrese una contraseña" }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor ingrese una dirección de correo electrónico válida" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres y contener al menos una mayúscula, una minúscula y un número" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    }),
  role: z.enum(["cliente", "admin"], {
    message: "Por favor seleccione un rol válido",
  }),
});

export const userSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor ingrese una dirección de correo electrónico válida" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    })
    .optional(),
  role: z.enum(["cliente", "admin"], {
    message: "Por favor seleccione un rol válido",
  }),
  avatar: z.string().optional(),
});

export const brandSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  image: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  image: z.string().optional(),
  categoryType: z.enum(["Featured", "Hot Categories", "Top Categories"], {
    message: "El tipo de categoría es requerido",
  }),
});

export const productSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  price: z.number().min(0, { message: "El precio debe ser un número positivo" }),
  discountPercentage: z.number().min(0).max(100).default(0),
  stock: z.number().min(0).default(0),
  category: z.string().min(1, { message: "Por favor seleccione una categoría" }),
  brand: z.string().min(1, { message: "Por favor seleccione una marca" }),
  image: z.string().min(1, { message: "Por favor sube una imagen" }),
});

export const bannerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  title: z.string().min(1, "El título es requerido"),
  startFrom: z.number().min(0, "StartFrom debe ser un número positivo"),
  image: z.string().min(1, "Por favor suba una imagen"),
  bannerType: z.string().min(1, "El tipo es requerido"),
});