import { ObjectId } from "mongodb";

export default class Note{
    constructor(public date : Date, public id?: ObjectId) {}
}