import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["user", "admin","deliveryman"],
        default: "user",
    },
    addresses: [
        {
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            isDefault: {
                type: Boolean,
                default: false,
            }
        }
    ],
    //lista de deseos
    //card
    //orden
}, {
    timestamps: true,
});

//hacer coincidir la contraseña introducida por el usuario con la contraseña cifrada en la base de datos.
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//encryptar la contraseña usando bcrypt

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


//  Ensure only one default address is default
userSchema.pre("save", function (next) {
    if (this.isModified("addresses")) {
        const defaultAddresses = this.addresses.filter((addr) => addr.isDefault);
        if (defaultAddresses) {
            this.addresses.forEach((addr) => {
                if (addr !== defaultAddresses) addr.isDefault = false;
            });
        }
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
