import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "./card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";

interface MultiImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
}

const MultiImageUpload = ({ value, onChange, disabled }: MultiImageUploadProps) => {
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (value) {
            setPreviews(value);
        }
    }, [value]);

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        maxSize: 10000000, // 10MB
        disabled,
        onDrop: async (acceptedFiles) => {
            const newImages = await Promise.all(
                acceptedFiles.map((file) => convertToBase64(file))
            );
            const updatedImages = [...previews, ...newImages];
            setPreviews(updatedImages);
            onChange(updatedImages);
        },
    });

    const handleRemove = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedImages = previews.filter((_, i) => i !== index);
        setPreviews(updatedImages);
        onChange(updatedImages);
    };

    return (
        <Card className="border-dashed overflow-hidden">
            <CardContent className="p-0">
                <div className="p-4 space-y-4">
                    <div
                        {...getRootProps({
                            className:
                                "flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-gray-50",
                        })}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center text-center">
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium text-gray-700">
                                Arrastra imágenes o haz clic para subir
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Soporta múltiples imágenes (max 10MB c/u)
                            </p>
                        </div>
                    </div>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {previews.map((url, index) => (
                                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                        src={url}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={(e) => handleRemove(index, e)}
                                            disabled={disabled}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MultiImageUpload;
