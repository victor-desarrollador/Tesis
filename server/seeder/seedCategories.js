import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/categoryModel.js";
import categories from "../data/categories.js";

dotenv.config();

// Helper para generar slugs manualmente
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("🧹 Limpiando categorías antiguas...");
        await Category.deleteMany();

        console.log("🌱 Insertando nuevas categorías...");

        for (const cat of categories) {
            // 1. Crear Categoría Padre con slug explícito
            const parentCategory = await Category.create({
                name: cat.name,
                description: cat.description,
                parent: null,
                slug: generateSlug(cat.name),
            });

            console.log(`> Categoría Padre creada: ${cat.name} (${parentCategory.slug})`);

            // 2. Crear Subcategorías con slugs explícitos
            if (cat.subcategories && cat.subcategories.length > 0) {
                const subcategoriesToInsert = cat.subcategories.map((sub) => ({
                    name: sub.name,
                    description: sub.description,
                    parent: parentCategory._id,
                    slug: generateSlug(sub.name),
                }));

                await Category.insertMany(subcategoriesToInsert);
                console.log(`  - ${subcategoriesToInsert.length} subcategorías insertadas`);
            }
        }

        console.log("✅ Importación de categorías finalizada!");
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Category.deleteMany();
        console.log("🗑️  Categorías eliminadas!");
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    deleteData();
} else {
    importData();
}
