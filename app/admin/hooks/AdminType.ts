export interface PortoProps {
    id: string;
    title: string;
    role: string;
    description: string;
    link?:string | null;
    image: string;
    is_active: boolean;
}

export interface ProjectFormData {
    title: string;
    role: string;
    description: string;
    image?: string;
    link?:string | null;
    id: string;
    is_active: boolean;
}

export interface ProjectParams{
    page?: number;
    title?: string;
    limit?: number;
    search?: string;
    offset?: number;
}

export interface ProjectResponse{
    data: PortoProps[];
    meta: PaginationMeta;
}

export interface ProfileData {
    username: string;
    email: string;
    phone: string;
    image?: string;
}

export interface PaginationMeta{
    total: number,
    filtered_total: number,
    per_page: number,
    current_page: number,
    last_page: number,
    current_page_url: string,
    first_page_url: string,
    last_page_url: string,
    next_page_url: string,
    prev_page_url: string | null,
    path: string,
    from: number,
    to: number,

}

export interface Content{
    id: number;
    title: string;
    body: string;
    category: string;
}

export interface ContentData{
    data: Content[];
}