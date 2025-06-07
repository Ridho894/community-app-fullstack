import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';

export const multerConfig = {
    dest: 'uploads/posts',
};

// Ensure upload directories exist
export const createFolders = (userId: number) => {
    // Make sure the base uploads directory exists
    if (!existsSync(multerConfig.dest)) {
        mkdirSync(multerConfig.dest, { recursive: true });
    }

    const userUploadPath = join(multerConfig.dest, userId.toString());

    if (!existsSync(userUploadPath)) {
        mkdirSync(userUploadPath, { recursive: true });
    }

    return userUploadPath;
};

// Multer upload options
export const multerOptions = {
    // Enable file size limits
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },

    // Check the mimetypes to allow
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(
                new HttpException(
                    `Unsupported file type ${extname(file.originalname)}`,
                    HttpStatus.BAD_REQUEST,
                ),
                false,
            );
        }
    },

    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const userId = req.user?.id;
            if (!userId) {
                return cb(
                    new HttpException(
                        'User ID not found in request',
                        HttpStatus.BAD_REQUEST,
                    ),
                    false,
                );
            }

            const userUploadPath = createFolders(userId);
            cb(null, userUploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            // Generating a unique name
            const filename = `${uuid()}${extname(file.originalname)}`;
            cb(null, filename);
        },
    }),
}; 