import { IUser } from "./user";

export interface IHousehold  {
	_id: string;
	name: string;
	owner: IUser;
	members: IUser[];
}