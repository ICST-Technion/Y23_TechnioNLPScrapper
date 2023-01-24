export class DataObject{
    public id: number;
    public title: string;
    public description: string;
    public url: string;
    public image: string;
    public date: string;
    public source: string;
    public category: string;
    public tags: string;
    public content: string;
    public author: string;
    public language: string;
    public country: string;
    public domain: string;
    public type: string;
    public status: string;
    public created_at: string;
    public updated_at: string;
    public deleted_at: string;

    constructor(
        id: number,
        title: string,
        description: string,
        url: string,
        image: string,
        date: string,
        source: string,
        category: string,
        tags: string,
        content: string,
        author: string,
        language: string,
        country: string,
        domain: string,
        type: string,
        status: string,
        created_at: string,
        updated_at: string,
        deleted_at: string
        ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.url = url;
        this.image = image;
        this.date = date;
        this.source = source;
        this.category = category;
        this.tags = tags;
        this.content = content;
        this.author = author;
        this.language = language;
        this.country = country;
        this.domain = domain;
        this.type = type;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at;
        }

    static copy = (obj: any) => {
        return Object.assign({}, obj);
    }
}