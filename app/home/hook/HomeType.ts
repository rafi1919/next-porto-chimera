export interface Porto {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
    role: string;
    stack: string[];
}

export interface ProjectData{
    data: Porto[];
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