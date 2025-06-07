export class PageMetaDto {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export class PageDto<T> {
    data: T[];
    meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }

    static create<T>(
        data: T[],
        total: number,
        page: number,
        limit: number,
    ): PageDto<T> {
        const totalPages = Math.ceil(total / limit);

        const meta: PageMetaDto = {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        };

        return new PageDto(data, meta);
    }
} 