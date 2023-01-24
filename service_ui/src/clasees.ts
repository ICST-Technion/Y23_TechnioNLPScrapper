export class DataObject{


    constructor(){}

    static copy = (obj: any) => {
        return Object.assign({}, obj);
    }
}