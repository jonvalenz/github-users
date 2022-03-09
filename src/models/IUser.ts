import IRepository from './IRepository';

export default interface IUser {
  id:string;
  login:string;
  name: string;
  picture?: string;
  repositories?: IRepository[];
}
